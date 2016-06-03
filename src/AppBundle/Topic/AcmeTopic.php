<?php

namespace AppBundle\Topic;

use AppBundle\Game\GameLogic;
use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Predis\ClientInterface;
use Ratchet\ConnectionInterface;
use Gos\Bundle\WebSocketBundle\Client\ClientManipulatorInterface;
use Ratchet\Wamp\Topic;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;

class AcmeTopic implements TopicInterface
{
    protected $clientManipulator;
    protected $redisClient;
    protected $game;
    /**
     * @param ClientManipulatorInterface $clientManipulator
     * @param ClientInterface $redis
     */
    public function __construct(ClientManipulatorInterface $clientManipulator, ClientInterface $redis)
    {
        $this->clientManipulator = $clientManipulator;
        $this->redisClient = $redis;
        $this->game= new GameLogic($redis);
    }

    /**
     * This will receive any Subscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        $roomId = $request->getAttributes()->get('room');
        $user = $this->clientManipulator->getClient($connection)->getUsername();

        if ($this->redisClient->zscore('rooms', $roomId)) {
            if (!$this->redisClient->sismember('room:'.$roomId.':members', $user)) {
                if ($this->redisClient->sismember('room:' . $roomId . ':lmembers', $user)) {
                    $this->redisClient->sadd('room:' . $roomId . ':members', $user);
                    $this->redisClient->srem('room:' . $roomId . ':lmembers', $user);
                    $topic->broadcast(['type'=>'entexit', 'msg' => $user . " has joined " . $this->redisClient->hget('room:' . $roomId, 'name')]);
                }

                $topic->broadcast(array('type' => "members", 'members' => $this->redisClient->smembers('room:'.$roomId.':members')));
            } else {
                $connection->event($topic->getId(), ['type'=>'entexit','msg' => 'Warning! Multiple game tabs are not allowed!']);
                $connection->close();
            }
        } else {
            $connection->event($topic->getId(), ['type'=>'entexit', 'msg' => 'Warning! Game doesn\'t exist.']);
            $connection->close();
        }
    }

    /**
     * This will receive any UnSubscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        $roomId = $request->getAttributes()->get('room');
        $user = $this->clientManipulator->getClient($connection)->getUsername();

        $userConnections = 0;
        foreach ($topic as $client) {
            if ($this->clientManipulator->getClient($client)->getUsername() == $user) {
                $userConnections++;
            }
        }

        if ($userConnections == 1) {
//            if ($this->redisClient->sismember('room:'.$roomId.':members', $user)) {

                //todo: add increment ws protection

                $this->redisClient->srem('room:' . $roomId . ':members', $user);

                if (!$this->redisClient->scard('room:' . $roomId . ':members')) {
                    // TODO: race condition fix
                    // everybody left, remove the room
                    $this->redisClient->zrem('rooms', $roomId);
                    $this->redisClient->del('room:' . $roomId);
                    $this->redisClient->del('room:' . $roomId . ':members');
                    $this->redisClient->del('room:' . $roomId . ':lmembers');
                } else {
                    $this->redisClient->hset('room:'.$roomId, 'owner', $this->redisClient->srandmember('room:'.$roomId.':members'));
                    $topic->broadcast(['type'=>'entexit' ,'msg' => $user . " has left " . $this->redisClient->hget('room:' . $roomId, 'name')]);
                    $topic->broadcast(array('type' => "members", 'members' => $this->redisClient->smembers('room:' . $roomId . ':members')));
                }
//            }
        }
    }

    /**
     * This will receive any Publish requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param $Topic topic
     * @param WampRequest $request
     * @param $event
     * @param array $exclude
     * @param array $eligibles
     * @return mixed|void
     */
    public function onPublish(ConnectionInterface $connection, Topic $topic, WampRequest $request, $event, array $exclude, array $eligible)
    {
        $roomId = $request->getAttributes()->get('room');
        if($event['type']=="message") {
            $this->game->start('room:' . $request->getAttributes()->get('room'));
            foreach ($this->redisClient->smembers('room:' . $roomId . ':members') as $usr) {

                $user1 = $this->clientManipulator->findByUsername($topic, $usr);
                $poruka = "your cards are:\n 1-" . $this->redisClient->zrange("room:" . $roomId . ":game:" . $usr . ":cards", 0, -1)[0];

                $topic->broadcast(array('type' => "message", 'usr' => $this->clientManipulator->getClient($connection)->getUsername(), 'msg' => $poruka), array(), array($user1['connection']->WAMP->sessionId));


            }


        }
        else if ($event['type']=="start" && $this->redisClient->hget("room:".$roomId, "owner")==$this->clientManipulator->getClient($connection)->getUsername()){
            $this->game->start('room:' . $request->getAttributes()->get('room'));
            $users=$this->redisClient->zrange('room:' . $roomId . ':game:members', 0, -1);
            foreach ($this->redisClient->smembers('room:' . $roomId . ':members') as $username) {
                $cardarr=$this->redisClient->zrange('room:' . $roomId . ':game:' . $username . ':cards', 0, -1);
                $user2 = $this->clientManipulator->findByUsername($topic, $username);
                $ind=$this->redisClient->get('room:'.$roomId.':game:st:index');
                if ($username===$this->redisClient->zrange('room:'.$roomId.':game:members', $ind , $ind )[0])
                    $topic->broadcast(['type' => "startst", 'cards'=>$cardarr, 'users'=>$users, 'stindex'=>$ind], [], [$user2['connection']->WAMP->sessionId]);
                else
                    $topic->broadcast(['type' => "start", 'cards'=>$cardarr, 'users'=>$users, 'stindex'=>$ind], [], [$user2['connection']->WAMP->sessionId]);
            }
        }
    }

    /**
     * Like RPC is will use to prefix the channel
     * @return string
     */
    public function getName()
    {
        return 'acme.topic';
    }
}