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
        //this will broadcast the message to ALL subscribers of this topic.
        if ($this->redisClient->sismember('room:'.$request->getAttributes()->get('room').':members', $connection->Session->getId())){

            if (!$this->redisClient->sismember('room:'.$request->getAttributes()->get('room').':rmembers', $connection->Session->getId())){

                $this->redisClient->sadd('room:'.$request->getAttributes()->get('room').':rmembers', $connection->Session->getId());
                $topic->broadcast(['msg' => $connection->Session->get('name') . " has joined " . $this->redisClient->hget('room:'.$request->getAttributes()->get('room'), 'name')]); //$topic->getId()]);
                $topic->broadcast(['msg' => $this->clientManipulator->getClient($connection) . " has joined " . $topic->getId()]);
            }
            else {
                //todo: add increment ws protection

                $connection->close();
            }
        }else $connection->close();


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
        //this will broadcast the message to ALL subscribers of this topic.
        if ($this->redisClient->sismember('room:'.$request->getAttributes()->get('room').':rmembers', $connection->Session->getId())){

            //todo: add increment ws protection

            $this->redisClient->srem('room:'.$request->getAttributes()->get('room').':rmembers', $connection->Session->getId());
            $this->redisClient->srem('room:'.$request->getAttributes()->get('room').':members', $connection->Session->getId());
            $topic->broadcast(['msg'=> $connection->resourceId."has left the room (channel\"" . $topic->getId() . "\")"]);

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
        /*
            $topic->getId() will contain the FULL requested uri, so you can proceed based on that

            if ($topic->getId() == "acme/channel/shout")
               //shout something to all subs.
        */

        echo "\n\n"." ".$connection->Session->getId();
        $response = array('type' => "message", 'usr' => $connection->Session->getId(), 'msg' => $event['msg']);
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