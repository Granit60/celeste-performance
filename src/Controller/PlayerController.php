<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\RequestStack;

final class PlayerController extends AbstractController
{
    #[Route('/player/{id}', name: 'player')]
    public function index(TranslatorInterface $ti, RequestStack $rs, Request $r, int $id): Response
    {
        $locale = $rs->getSession()->get("_locale") 
            ?? $r->attributes->get("_locale")
            ?? "en_US";
        $ti->setLocale($locale);

        return $this->render('player.html.twig', [
            "_locale" => $locale,
            "id" => $id
        ]);
    }
}
