<?php

namespace AppBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Room
{
    /**
     * @Assert\Regex(
     *     pattern="/^\w{0,20}$/",
     *     message="Only up to 20 [a-zA-Z0-9_] characters allowed."
     * )
     */
    private $name;

    private $owner;

    /**
     * @Assert\Regex(
     *     pattern="/^\w{0,10}$/",
     *     message="Only up to 10 [a-zA-Z0-9_] characters allowed."
     * )
     */
    private $password;

    /**
     * @Assert\Range(
     *      min = 4,
     *      max = 6,
     * )
     */
    private $maxMembers;

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * @param mixed $owner
     */
    public function setOwner($owner)
    {
        $this->owner = $owner;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * @return mixed
     */
    public function getMaxMembers()
    {
        return $this->maxMembers;
    }

    /**
     * @param mixed $maxMembers
     */
    public function setMaxMembers($maxMembers)
    {
        $this->maxMembers = $maxMembers;
    }
}