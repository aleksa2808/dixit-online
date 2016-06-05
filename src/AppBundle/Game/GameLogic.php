<?php


namespace AppBundle\Game;

use Predis\ClientInterface;

class GameLogic
{
    protected $stri;
    protected $redisClient;

    /**
     * @param ClientInterface $redis
     */
    public function __construct(ClientInterface $redis)
    {
        $this->redisClient = $redis;
        $this->stri = "hehe";
    }


    public function start($room){
        if ($this->redisClient->setnx($room.':game:state', "1" ) && $this->redisClient->scard($room.':members')>=4){

            $this->redisClient->sadd($room.":gamedel", $room.':game:state');
            //init card deck
            for ($i=1; $i<=107; $i++)
                $this->redisClient->sadd($room.':game:cards',array($i));

            $this->redisClient->sadd($room.":gamedel", $room.":game:cards");
            // st = storyteller

            // picking random storyteller
            $this->redisClient->set($room.":game:st:index", rand(0, $this->redisClient->scard($room.':members')-1));
            $this->redisClient->set($room.":game:st:card", 0);
            $this->redisClient->set($room.":game:st:phrase", "n/a");

            $this->redisClient->sadd($room.":gamedel", [$room.":game:st:index", $room.":game:st:card", $room.":game:st:phrase"]);

            $num=0;
            foreach ($this->redisClient->smembers($room.':members') as $mem){
                $num++;
                $this->redisClient->zadd($room.':game:members', array ($mem=>$num));
                $this->redisClient->set($room.':game:'.$mem.':points', 0);
                $this->redisClient->set($room.':game:'.$mem.':submitted', 0);
                $this->redisClient->set($room.':game:'.$mem.':voted', 0);
                $this->redisClient->set($room.':game:'.$mem.':missingno', 0);



                for ($j=1; $j<=6;$j++){
                    $crd = $this->redisClient->spop($room.':game:cards');
                    $this->redisClient->zadd($room.':game:'.$mem.':cards', array ($crd=>$j));
                }
                $this->redisClient->sadd($room.":gamedel",
                    [   $room.':game:'.$mem.':points',
                        $room.':game:'.$mem.':voted',
                        $room.':game:'.$mem.':submitted',
                        $room.':game:'.$mem.':missingno',
                        $room.':game:'.$mem.':cards'
                    ]);

            }
            $this->redisClient->sadd($room.":gamedel",
                [   $room.":game:members",
                    $room.":game:submitset",
                    $room.":game:cardVotes",
                    $room.":game:shuffledCards",
                    $room.":game:votes"
                ]);
            return true;
        }else return false;
    }

    //REGULAR USER
    public function submit($room, $user, $index){
        if ($this->redisClient->get($room.":game:state")==2 && $this->redisClient->get($room.":game:".$user.":submitted")==0) {

            $card = $this->redisClient->zrange($room.":game:".$user.":cards", $index, $index);
            $card = $card[0];
            $this->redisClient->set($room.":game:".$user.":submitted", $card);
            $this->redisClient->zremrangebyrank($room.":game:".$user.":cards", $index, $index);
            $this->redisClient->set($room.':game:'.$user.':missingno', $index);
            $this->redisClient->sadd($room.":game:submitset", $card);

            if ($this->redisClient->scard($room.":game:submitset")==$this->redisClient->zcard($room . ":game:members")){
                //next game state if all members submitted their cards
                $this->redisClient->set($room.":game:state", 3);
                //shuffle the deck
                $cardNum=$this->redisClient->scard($room.":game:submitset");
                $this->redisClient->zremrangebyrank($room.":game:cardVotes", 0, -1);
                for ($i=1; $i<=$cardNum; $i++){
                    $tempCard=$this->redisClient->spop($room.':game:submitset');
                    $this->redisClient->zadd($room.":game:shuffledCards", array ($tempCard=>$i));
                    $this->redisClient->zadd($room.":game:cardVotes", array (0=>$i));
                }

                //broadcast the shuffled cards, switch to next case (voting)
                return 2;
            }else return 1;
        } else return 0;
    }

    //NARRATOR
    public function submitNarrator($room, $user, $index, $phrase){
        if ($this->redisClient->get($room.":game:state")==1 && 
            $this->redisClient->zscore($room.':game:members', $user)==((int)$this->redisClient->get($room.":game:st:index")+1)){
                //find card and set as current storyteller's card & add it into the submitted cards set
                $tempCard=$this->redisClient->zrange($room.":game:".$user.":cards", $index, $index)[0];
                $this->redisClient->set($room.":game:st:card", $tempCard);
                $this->redisClient->sadd($room.":game:submitset", $tempCard);

                //remove card from storyteller's hand
                $this->redisClient->zremrangebyrank($room.":game:".$user.":cards", $index, $index);
                $this->redisClient->set($room.':game:'.$user.':missingno', $index);

                //set phrase
                $this->redisClient->set($room.":game:st:phrase", $phrase);

                //set number of votes left
                $this->redisClient->set($room.":game:state", 2);
                $this->redisClient->set($room.":game:votes", $this->redisClient->scard($room.":members")-1);
                //websocket should broadcast the phrase to everyone, switch to next state(
                return true;
        }   else return false;
    }

    public function vote($room, $user, $index){
        //ma kakve provere, kakvi bakraci

        $redis=$this->redisClient;
        if ($redis->get($room.":game:state")==3) {

            //setting the vote
            $redis->set($room . ":game:" . $user . ":voted", $index);
            $redis->decr($room . ":game:votes");


            //end of voting
            if ($redis->get($room . ":game:votes") == 0) {
                //crna madjija dodeljivanja poena

                $votesArr=[];
                $voterArr=[];
                $ownerArr=[];

                $stIndex=$redis->get($room.":game:st:index");

                $submitted=$redis->zrange($room.":game:shuffledCards",0,-1);
                $stCardIndex=$redis->zrank($room.":game:shuffledCards",$redis->get($room.":game:st:card"));

                for($i=0;$i<count($submitted);$i++){
                    $votesArr[$i]=0;
                    $ownerArr[$i]=-1;
                    $voterArr[$i]=-1;
                }
                $members=$redis->zrange($room.":game:members",0,-1);

                for ($i=0; $i<count($members); $i++){
                    $t1=$redis->get($room.":game:".$members[$i].":submitted");
                    $t2=$redis->zrank($room.":game:shuffledCards", $t1);
                    $ownerArr[$t2]=$i;
                    if ($stIndex==$i) continue;
                    $tvote=$redis->get($room.":game:".$members[$i].":voted");
                    $voterArr[$i]=$tvote;
                    $votesArr[$tvote]++;
                }

                if($votesArr[$stCardIndex]==0 || ($votesArr[$stCardIndex]==count($members)-1)){
                    for($i=0;$i<count($members);$i++){
                        if ($i==$stIndex) continue;
                        $redis->incrby($room.":game:".$members[$i].":points",2);
                    }
                }else {
                    //storyteller+3
                    $redis->incrby($room.":game:".$members[$stIndex].":points",3);
                    //+3 for all who guessed it right
                    for ($i = 0; $i < count($members); $i++) {
                        if ($i!=$stIndex && $voterArr[$i]==$stCardIndex){
                            $redis->incrby($room.":game:".$members[$i].":points",3);
                        }
                    }

                    //+1 for all others
                    for ($i=0; $i< count($submitted); $i++){
                        if ($i!=$stCardIndex && $votesArr[$i]>0){
                            $redis->incrby($room.":game:".$members[$ownerArr[$i]].":points", $votesArr[$i]);
                        }
                    }
                }
                $maxpoints = 0;
                foreach ($members as $mem){
                    $t=$redis->get($room.":game:".$mem.":points");
                    if ($maxpoints<$t) $maxpoints=$t;
                }

                $redis->del($room.":game:shuffledCards");
                if ($maxpoints >=5 || $redis->scard($room.":game:cards")<$redis->scard($room.":members")){
                    //end
                    $points=[];
                    foreach ($members as $mem){
                        $points[$mem]=$redis->get($room.":game:".$mem.":points");
                    }
                    $delarray=$redis->smembers($room.":gamedel");
                    foreach ($delarray as $t) $redis->del($t);
                    $redis->del($room.":gamedel");


                    return ['type'=>2, 'mems'=>$members, 'points'=>$points];
                }else {
                    $redis->set($room . ":game:state", 1);

                    foreach ($members as $mem){
                        $tempCard = $redis->spop($room.":game:cards");
                        $miss=$redis->get($room.":game:".$mem.":missingno");
                        $redis->zadd($room.":game:".$mem.":cards", [$tempCard=>((int)$miss+1)]);
                        $redis->set($room.":game:".$mem.":submitted", 0);
                    }

                    $curSt=$redis->get($room.":game:st:index");
                    $curSt= ((int)$curSt+1)%count($members);
                    $redis->set($room.":game:st:index", $curSt);

                    $resultArr=[];
                    $memArr=$redis->zrange($room.":game:members",0,-1);
                    for($i=0;$i<count($memArr);$i++){
                        $resultArr[$i]=$redis->get($room.":game:".$memArr[$i].":points");
                    }
                    return ['type'=>1, 'votesArr'=>$votesArr, 'voterArr'=>$voterArr, 'ownerArr'=>$ownerArr, 'resultArr'=>$resultArr];
                }


                // if ($points >= 30) {
                //      end();
                //      return 2;
                //}else

                //websocket broadcasts results

            }
            return ['type'=>0];
        }
    }
}