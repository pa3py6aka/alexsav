<?php

namespace App\Controller;


use App\Entity\User;
use App\Form\SignUpFormType;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use App\Security\LoginFormAuthenticator;

class AuthController extends BaseController
{
    private EmailVerifier $emailVerifier;

    public function __construct(EmailVerifier $emailVerifier, EntityManagerInterface $entityManager)
    {
        parent::__construct($entityManager);
        $this->emailVerifier = $emailVerifier;
    }

    /**
     * @Route("/login", name="app_login", methods="POST")
     */
    public function login(AuthenticationUtils $authenticationUtils): void
    {}

    /**
     * @Route("/auth/signup", name="app_signup", methods="POST")
     */
    public function signup(
        Request $request,
        UserPasswordEncoderInterface $passwordEncoder,
        GuardAuthenticatorHandler $authGuard,
        LoginFormAuthenticator $loginFormAuthenticator
    ): Response
    {
        $user = new User();
        $form = $this->createForm(SignUpFormType::class, $user);
        $form->handleRequest($request);
        $form->submit($request->request->all());

        if ($form->isValid()) {
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );
            $user->setStatus(User::STATUS_NOT_CONFIRM);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
                (new TemplatedEmail())
                    ->from(new Address('robot@alexsav.ru', 'Alexsav.ru Mail Robot'))
                    ->to($user->getEmail())
                    ->subject('Please Confirm your Email')
                    ->htmlTemplate('registration/confirmation_email.html.twig')
            );

            return $authGuard->authenticateUserAndHandleSuccess($user, $request, $loginFormAuthenticator, 'main');
        }

        return $this->json([
            'result' => false,
            'errors' => $this->getErrorMessages($form),
        ]);
    }

    /**
     * @Route("/logout", name="app_logout", methods="POST")
     */
    public function logout()
    {
        throw new \LogicException('This must be intercepted by firewall!');
    }

    /**
     * @Route("/verify/email", name="app_verify_email")
     */
    public function verifyUserEmail(Request $request): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $this->getUser());
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());

            return $this->redirectToRoute('app_register');
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirectToRoute('app_register');
    }
}
