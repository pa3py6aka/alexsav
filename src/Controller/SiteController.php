<?php

namespace App\Controller;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SiteController extends BaseController
{
    /**
     * @Route("/", name="app_main")
     * @Route("/top-news", name="top-news", requirements={"route"="^(?!.*_wdt|_profiler).+"})
     */
    public function index(): Response
    {
        return $this->render('site/index.html.twig');
    }
}
