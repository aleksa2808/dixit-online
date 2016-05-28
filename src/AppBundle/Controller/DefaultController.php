<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Room;
use AppBundle\Form\CreateRoomType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $form = $this->createForm(CreateRoomType::class, new Room());

        return $this->render('default/index.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * @Route("/entry", name="entry")
     */
    public function entryAction(Request $request)
    {
        return $this->render('default/entry.html.twig');
    }

    /**
     * @Route("/lobby/{roomId}", name="lobby", requirements={
     *     "roomId": "\d+"
     * })
     */
    public function lobbyAction(Request $request, $roomId)
    {
        $redis = $this->container->get('snc_redis.default');
        if (!$redis->zscore('rooms', $roomId))
        {
            $this->addFlash(
                'notice',
                'Room #'.$roomId.' doesn\'t exist!'
            );
            return $this->redirectToRoute('homepage');
        }

        $sessionId = $request->getSession()->getId();
        if (!$redis->sismember('room:'.$roomId.':members', $sessionId))
        {
            $redis->sadd('room:'.$roomId.':members', $sessionId);
        }
        else if ($redis->sismember('room:'.$roomId.':rmembers', $sessionId)){
            $this->addFlash(
                'notice',
                'Already in this room!'
            );
            return $this->redirectToRoute('homepage');

        }

        $members = $redis->smembers('room:'.$roomId.':members');

        return $this->render('default/lobby.html.twig', array(
            'room' => $roomId,
            'members' => $members
        ));
    }

    /**
     * @Route("/create-room", name="create-room")
     */
    public function createRoomAction(Request $request)
    {
        if($request->isXmlHttpRequest()) {
            $room = new Room();

            $form = $this->createForm(CreateRoomType::class, $room);

            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid())
            {
                $room->setOwner($request->getSession()->getId());
                if ($room->getName() == "") $room->setName("unnamed");
                if ($room->getMaxMembers() == "") $room->setMaxMembers(6);

                $redis = $this->container->get('snc_redis.default');
                $roomId = $redis->incr('room:id');
                $redis->hmset('room:'.$roomId, array(
                        'name' => $room->getName(),
                        'maxMembers' => $room->getMaxMembers(),
                        'password' => $room->getPassword(),
                        'owner' => $room->getOwner()
                ));
                $redis->sadd('room:'.$roomId.':members', $room->getOwner());
                $redis->zadd('rooms', array($roomId => $roomId));

                // TODO: Better success signal needed
                return new JsonResponse($roomId);
            }

            return $this->render('default/form.html.twig', array(
                'form' => $form->createView(),
            ));
        } else {
            return $this->redirect($this->generateUrl('homepage'));
        }
    }

    /**
     * @Route("/get-rooms/{roomsPage}", name="get-rooms", defaults={"roomsPage" = 0}, requirements={
     *     "roomsPage": "\d+"
     * })
     */
    public function getRoomsAction(Request $request, $roomsPage)
    {
        if($request->isXmlHttpRequest()) {
            $ROOMS_PER_PAGE = 10;

            $redis = $this->container->get('snc_redis.default');
            $roomIds = $redis->zrange('rooms', $ROOMS_PER_PAGE * $roomsPage, $ROOMS_PER_PAGE * $roomsPage + $ROOMS_PER_PAGE - 1);

            $rooms = array();

            foreach ($roomIds as $roomId) {
                $roomInfo = $redis->hgetall('room:'.$roomId);
                $numMembers = $redis->scard('room:'.$roomId.':members');

                if ($roomInfo && false !== $numMembers) {
                    $roomTableRow = array(
                        'id' => $roomId,
                        'name' => $roomInfo['name'],
                        'owner' => $roomInfo['owner'],
                        'hasPassword' => $roomInfo['password'] != "" ? 'Yes' : 'No',
                        'members' => $numMembers.'/'.$roomInfo['maxMembers']
                    );
                    array_push($rooms, $roomTableRow);
                }
            }

            return new JsonResponse($rooms);
        } else {
            return $this->redirect($this->generateUrl('homepage'));
        }
    }
}
