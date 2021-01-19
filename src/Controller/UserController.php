<?php


namespace App\Controller;


use Symfony\Component\Routing\Annotation\Route;

class UserController extends BaseController
{
    /**
     * @Route("/user/me", name="user_data")
     */
    public function me()
    {

    }
}