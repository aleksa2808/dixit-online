<?php

// Tests/ApplicationAvailabilityFunctionalTest.php
namespace Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApplicationAvailabilityFunctionalTest extends WebTestCase
{
    /**
    * @dataProvider urlProvider
    */
    public function testPageIsSuccessful($url)
    {
        $client = self::createClient();
        $client->request('GET', $url);

        $this->assertTrue($client->getResponse()->isSuccessful() || $client->getResponse()->isRedirect());
    }

    public function urlProvider()
    {
        return array(
            array('/'),
            array('/login'),
            array('/register'),
            array('/resetting/request'),
            array('/admin'),
            array('/profile'),
            array('/profile/change-password'),
            array('/profile/edit'),
            array('/lobby/1'),
        );
    }
}