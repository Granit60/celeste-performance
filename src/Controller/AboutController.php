<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\RequestStack;

final class AboutController extends AbstractController
{
    #[Route('/about', name: 'about')]
    public function index(TranslatorInterface $ti, RequestStack $rs, Request $r): Response
    {
        $locale = $rs->getSession()->get("_locale") 
            ?? $r->attributes->get("_locale")
            ?? "en_US";
        $ti->setLocale($locale);
        return $this->render('about.html.twig', [
            "_locale" => $locale
        ]);
    }
}
