<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\University;
use App\Models\Location;

class LinkUniversitiesToLocations extends Command
{
    protected $signature = 'universities:link-locations';
    protected $description = 'Link universities to random locations (for testing)';

    public function handle()
    {
        $universities = University::all();
        $locationIds = Location::pluck('id');

        foreach ($universities as $university) {
            // Link each university with 1-2 random locations
            $randomLocationIds = $locationIds->random(rand(1, 2))->toArray();
            $university->locations()->sync($randomLocationIds);
        }

        $this->info('Universities successfully linked to random locations!');
    }
}
