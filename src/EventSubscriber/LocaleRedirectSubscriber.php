<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\RequestStack;

use Symfony\Contracts\Translation\TranslatorInterface;

class LocaleRedirectSubscriber implements EventSubscriberInterface
{
    private RouterInterface $router;
    private RequestStack $requestStack;
    private TranslatorInterface $translatorInterface;

    public function __construct(RouterInterface $router, RequestStack $requestStack, TranslatorInterface $translatorInterface)
    {
        $this->router = $router;
        $this->requestStack = $requestStack;
        $this->translatorInterface = $translatorInterface;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $pathInfo = $request->getPathInfo();

        $localePattern = str_replace(",",'|', $_ENV["SUPPORTED_LOCALES"]);
        
        if (preg_match("#^(?P<path>.*)/(?P<locale>$localePattern)$#", $pathInfo, $matches)) {        
            $locale = $matches['locale'];
            $cleanPath = $matches['path'];        

            $request->attributes->set('_locale', $locale);
            $request->setLocale($locale);
            $session = $this->requestStack->getSession();
            if ($session) {
                $session->set('_locale', $locale);
            }

            $queryString = $request->getQueryString();
            $url = $cleanPath . ($queryString ? '?' . $queryString : '');

            $event->setResponse(new RedirectResponse($url != "" ? $url :  "/"));
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}
