<?php

namespace Trexzactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ServerDeleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $serverName, public string $username)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->greeting('Hello ' . $this->username . '.')
            ->line('Your server "' . $this->serverName . '" has been deleted from our system.')
            ->line('If this was unexpected, please contact support.');
    }
}
