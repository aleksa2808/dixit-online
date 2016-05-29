<?php

namespace AppBundle\Topic;

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

    /**
     * @param ClientManipulatorInterface $clientManipulator
     * @param ClientInterface $redis
     */
    public function __construct(ClientManipulatorInterface $clientManipulator, ClientInterface $redis)
    {
        $this->clientManipulator = $clientManipulator;
        $this->redisClient = $redis;
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
                    $topic->broadcast(['msg' => $user . " has joined " . $this->redisClient->hget('room:' . $roomId, 'name')]);
                }

                $topic->broadcast(array('type' => "members", 'members' => $this->redisClient->smembers('room:'.$roomId.':members')));
            } else {
                $connection->event($topic->getId(), ['msg' => 'Warning! Multiple game tabs are not allowed!']);
                $connection->close();
            }
        } else {
            $connection->event($topic->getId(), ['msg' => 'Warning! Game doesn\'t exist.']);
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
            // TODO: better page refresh handling
            if ($this->redisClient->zscore('rooms', $roomId)) {
//            if ($this->redisClient->sismember('room:'.$roomId.':members', $user)) {

                //todo: add increment ws protection

                $this->redisClient->srem('room:' . $roomId . ':members', $user);

                if (!$this->redisClient->scard('room:' . $roomId . ':members')) {
                    // TODO: race condition fix
                    // everybody left, remove the room
                    $this->redisClient->zrem('rooms', $roomId);
                    $this->redisClient->del('room:' . $roomId);
                    $this->redisClient->del('room:' . $roomId . 'members');
                    $this->redisClient->del('room:' . $roomId . 'lmembers');
                } else {
                    $topic->broadcast(['msg' => $user . " has left " . $this->redisClient->hget('room:' . $roomId, 'name')]);
                    $topic->broadcast(array('type' => "members", 'members' => $this->redisClient->smembers('room:' . $roomId . ':members')));
                }
//            }
            }
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
        $response = array('type' => "message", 'usr' => $this->clientManipulator->getClient($connection)->getUsername(), 'msg' => $event['msg']);
        $topic->broadcast($response);
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