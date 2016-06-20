<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\Client;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class DefaultControllerTest extends WebTestCase
{
    /**
     * @var Client
     */
    protected $client = null;

    public function testIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/');
        $crawler = $client->followRedirect();

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertTrue($crawler->filter('html:contains("Welcome to DiXit!")')->count() === 1);
    }
    
    public function testLogin()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/login');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertTrue($crawler->filter('html:contains("Welcome to DiXit!")')->count() === 1);
    }

    public function testRegister()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/register/');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertTrue($crawler->filter('html:contains("Register as a new user")')->count() === 1);
    }

    public function testResetPassword()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/resetting/request');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertTrue($crawler->filter('html:contains("Reset password")')->count() === 1);
        $this->assertTrue($crawler->filter('html:contains("Username or email address")')->count() === 1);
    }

    public function testUserLogin() {

        $client = static::createClient();
        $crawler = $client->request('GET', '/login');

        $form = $crawler->selectButton('_submit')->form(array(
            '_username'  => 'aleksa2808',
            '_password'  => 'lepass',
        ));

        $client->submit($form);
        $crawler = $client->followRedirect();

        $this->assertTrue($crawler->filter('html:contains("Available games")')->count() === 1);
    }

    public function testAdmin() {

        $client = static::createClient();
        $crawler = $client->request('GET', '/login');

        $form = $crawler->selectButton('_submit')->form(array(
            '_username'  => 'aleksa2808',
            '_password'  => 'lepass',
        ));

        $client->submit($form);
        $client->followRedirect();

        $crawler = $client->request('GET', '/admin/');
        $this->assertTrue($crawler->filter('html:contains("User")')->count() === 1);
    }
}
