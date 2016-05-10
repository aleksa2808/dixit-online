<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/lobby", name="lobby")
     */
    public function lobbyAction(Request $request)
    {
        $list = array("Toto", "Sandra", "sezam", "waldo", "Torus");

        return $this->render('default/lobby.html.twig', array('list' => $list));
    }

    /**
     * @Route("/game", name="game")
     */
    public function gameAction(Request $request)
    {
        return $this->render('default/game.html.twig');
    }

    /**
     * @Route("/results", name="results")
     */
    public function resultsAction(Request $request)
    {
        return $this->render('default/results.html.twig');
    }
}
