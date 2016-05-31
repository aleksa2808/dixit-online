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
        if ($this->redisClient->setnx($room.':game:state', "1" )// && $this->redisClient->scard($room.':members')>=4){
        ){
            //init card deck
            for ($i=1; $i<=118; $i++)
                $this->redisClient->sadd($room.':game:cards',array($i));


            // st = storyteller

            // picking random storyteller
            $this->redisClient->set($room.":game:st:index", rand(1, $this->redisClient->scard($room.':members')));
            $this->redisClient->set($room.":game:st:card", 0);
            $this->redisClient->set($room.":game:st:phrase", "n/a");

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

            }
            return true;
        }else return false;
    }

    public function submit($room, $user, $index){
        if ($this->redisClient->get($room.":game:state")==2 && $this->redisClient->get($room.":game:".$user.":cards")==0) {
            $card = $this->redisClient->zrange($room.":game:".$user.":cards", $index-1, $index-1);
            $card = $card[0];
            $this->redisClient->zremrangebyscore($room.":game:".$user.":cards", $index-1, $index-1);
            $this->redisClient->set($room.':game:'.$user.':missingno', $index);
            $this->redisClient->sadd($room.":game:submitset", $card);

            if ($this->redisClient->zcard($room.":game:submitset")==$this->redisClient->zcard($room . ":game:members")){
                //next game state if all members submitted their cards
                $this->redisClient->set($room.":game:state", 3);

                //shuffle the deck
                $cardNum=$this->redisClient->zcard($room.":game:submitset");
                for ($i=1; $i<=$cardNum; $i++){
                    $tempCard=$this->redisClient->spop($room.':game:submitset');
                    $this->redisClient->zadd($room.":game:shuffledCards", array ($tempCard=>$i));
                }

                //broadcast the shuffled cards, switch to next case (voting)
                return 2;
            }else return 1;
        } else return 0;
    }
    public function submitNarrator($room, $user, $index, $phrase){
        if ($this->redisClient->get($room.":game:state")==1 && 
            $this->redisClient->zscore($room.':game:members', $user)==$this->redisClient->get($room.":game:st:index")){
                //find card and set as current storyteller's card & add it into the submitted cards set
                $tempCard=$this->redisClient->zrange($room.":game:".$user.":cards", $index-1, $index-1);
                $this->redisClient->set($room.":game:st:card", $tempCard);
                $this->redisClient->sadd($room.":game:submitset", $tempCard);

                //remove card from storyteller's hand
                $this->redisClient->zremrangebyscore($room.":game:".$user.":cards", $index-1, $index-1);
                $this->redisClient->set($room.':game:'.$user.':missingno', $index);

                //set phrase
                $this->redisClient->set($room.":game:st:phrase", $phrase);

                //set number of votes left
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
            $redis->set($room . ":game:" . $user . ":voted", $index - 1);
            $redis->decr($room . ":game:votes");

            //end of voting
            if ($redis->get($room . ":game:votes") == 0) {
                //crna madjija dodeljivanja poena

                $redis->set($room . ":game:state", 1);
                // if ($points >= 30) {
                //      end();
                //      return 2;
                //}else

                //websocket broadcasts results
                return 1;
            }
        }
    }
}