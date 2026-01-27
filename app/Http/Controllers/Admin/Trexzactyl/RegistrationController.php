<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Traits\Commands\EnvironmentWriterTrait;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\RegistrationFormRequest;

class RegistrationController extends Controller
{
    use EnvironmentWriterTrait;

    /**
     * RegistrationController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Trexzactyl settings interface.
     */
    public function index(): View
    {
        return view('admin.trexzactyl.registration', [
            'enabled' => $this->settings->get('trexzactyl::registration:enabled', false),
            'verification' => $this->settings->get('trexzactyl::registration:verification', false),

            'discord_enabled' => $this->settings->get('trexzactyl::discord:enabled', false),
            'discord_id' => $this->settings->get('trexzactyl::discord:id', 0),
            'discord_secret' => $this->settings->get('trexzactyl::discord:secret', 0),

            'cpu' => $this->settings->get('trexzactyl::registration:cpu', 100),
            'memory' => $this->settings->get('trexzactyl::registration:memory', 1024),
            'disk' => $this->settings->get('trexzactyl::registration:disk', 5120),
            'slot' => $this->settings->get('trexzactyl::registration:slot', 1),
            'port' => $this->settings->get('trexzactyl::registration:port', 1),
            'backup' => $this->settings->get('trexzactyl::registration:backup', 1),
            'database' => $this->settings->get('trexzactyl::registration:database', 0),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(RegistrationFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::' . $key, $value);
        }

        $this->writeToEnvironment([
            'DISCORD_CLIENT_ID' => $request->input('discord:id'),
            'DISCORD_CLIENT_SECRET' => $request->input('discord:secret'),
            'DISCORD_REDIRECT_URI' => config('app.url') . '/auth/discord/callback',
        ]);

        $this->alert->success('Trexzactyl Registration has been updated.')->flash();

        return redirect()->route('admin.trexzactyl.registration');
    }
}
