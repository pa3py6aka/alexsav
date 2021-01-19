<?php

namespace App\Command;


use App\Rabbit\Producer\MailSenderProducer;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class TestConsumerCommand extends Command
{
    protected static $defaultName = 'rabbit-test';

    private MailSenderProducer $producer;

    public function __construct(MailSenderProducer $producer)
    {
        $this->producer = $producer;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->producer->publish("Здаров!\nYOOO!!!\n\n");
        return Command::SUCCESS;
    }
}