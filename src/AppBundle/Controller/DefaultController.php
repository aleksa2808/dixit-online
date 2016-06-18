<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Room;
use AppBundle\Form\CreateRoomType;
use Predis\Transaction\MultiExec;
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
     * @Route("/lobby/{roomId}", name="lobby", requirements={
     *     "roomId": "\d+"
     * })
     */
    public function lobbyAction($roomId)
    {
        $redis = $this->container->get('snc_redis.default');
        $user = $this->getUser()->getUsername();

        // checks if room exists
        if (!$redis->zscore('rooms', $roomId))
        {
            // checks if the user has a ticket for this room
            if ($room = $redis->hgetall('ticket:'.$user.':'.$roomId))
            {
                $redis->hmset('room:' . $roomId, array(
                    'name' => $room['name'],
                    'owner' => $user,
                    'password' => $room['password'],
                    'maxMembers' => $room['maxMembers'],
                ));
                $redis->sadd('room:' . $roomId . ':lmembers', $user);
                $redis->zadd('rooms', array($roomId => $roomId));

                $redis->del('ticket:'.$user.':'.$roomId);
            }
            else
            {
                $this->addFlash(
                    'notice',
                    'Room #' . $roomId . ' doesn\'t exist!'
                );
                return $this->redirectToRoute('homepage');
            }
        }
        else if ($redis->hget('room:'.$roomId, 'maxMembers') > $redis->scard('room:'.$roomId.':members'))
        { // TODO: race condition fix
            $redis->sadd('room:' . $roomId . ':lmembers', $user);
        }

        return $this->render('default/lobby.html.twig', array(
            'room' => $roomId,
        ));
    }

    /**
     * @Route("/create-room", name="create-room")
     */
    public function createRoomAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $room = new Room();

            $form = $this->createForm(CreateRoomType::class, $room);

            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid())
            {
                $user = $this->getUser()->getUsername();
                if ($room->getName() == "") $room->setName("unnamed");
                if ($room->getMaxMembers() == "") $room->setMaxMembers(6);

                $redis = $this->container->get('snc_redis.default');
                $roomId = $redis->incr('room:id');
                $redis->hmset('ticket:'.$user.':'.$roomId, array(
                        'name' => $room->getName(),
                        'maxMembers' => $room->getMaxMembers(),
                        'password' => $room->getPassword()
                ));

                // ticket expires after 5 mins
                $redis->expire('ticket:'.$user.':'.$roomId, 300);

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
        if($request->isXmlHttpRequest())
        {
            $ROOMS_PER_PAGE = 10;

            $redis = $this->container->get('snc_redis.default');
            $roomIds = $redis->zrange('rooms', $ROOMS_PER_PAGE * $roomsPage, $ROOMS_PER_PAGE * $roomsPage + $ROOMS_PER_PAGE - 1);

            $rooms = array();

            foreach ($roomIds as $roomId)
            {
                $responses = $redis->transaction()->hgetall('room:'.$roomId)->scard('room:'.$roomId.':members')->execute();
                $roomInfo = $responses[0];
                $numMembers = $responses[1];

                if ($roomInfo && false !== $numMembers)
                {
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
        }
        else
        {
            return $this->redirect($this->generateUrl('homepage'));
        }
    }
}
