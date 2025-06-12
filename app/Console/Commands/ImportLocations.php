<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Location;
use App\Models\University;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class ImportLocations extends Command
{
    protected $signature = 'import:locations';
    protected $description = 'Import locations from JSON file and geocode them';

    public function handle()
    {
        // Read the JSON file
        $jsonPath = database_path('data/locations.json');
        $locationsData = json_decode(File::get($jsonPath), true);

        if (!$locationsData) {
            $this->error('Failed to parse locations JSON file!');
            return 1;
        }

        $this->info('📄 Raw JSON: ' . json_encode($locationsData, JSON_PRETTY_PRINT));
        $this->info('✅ JSON loaded and decoded.');

        // Get all universities to match with locations
        $universities = University::all();
        
        if ($universities->isEmpty()) {
            $this->error('No universities found in the database. Please seed universities first.');
            return 1;
        }

        foreach ($locationsData as $locationData) {
            try {
                // Get coordinates using Nominatim geocoding service
                $response = Http::get('https://nominatim.openstreetmap.org/search', [
                    'q' => $locationData['location'] . ', Lebanon',
                    'format' => 'json',
                    'limit' => 1
                ]);

                if ($response->successful() && !empty($response->json())) {
                    $geocodeData = $response->json()[0];
                    
                    // Create location with coordinates
                    $location = new Location([
                        'address' => $locationData['location'],
                        'latitude' => $geocodeData['lat'],
                        'longitude' => $geocodeData['lon']
                    ]);

                    // Find a university to associate with this location
                    // You might want to modify this logic based on your needs
                    $university = $universities->first();
                    
                    if ($university) {
                        $location->university_id = $university->id;
                        $location->save();
                        
                        $this->info("Created location: {$locationData['location']} for university: {$university->name}");
                    } else {
                        $this->warn("Skipped location: {$locationData['location']} - No university found");
                    }
                } else {
                    $this->warn("Could not geocode location: {$locationData['location']}");
                }

                // Respect Nominatim's usage policy with a delay between requests
                sleep(1);
            } catch (\Exception $e) {
                $this->error("Error processing location {$locationData['location']}: " . $e->getMessage());
            }
        }

        $this->info('Location import completed!');
        return 0;
    }
}
