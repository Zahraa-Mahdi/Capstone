<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;

class AlmaarefUniversitySeeder extends Seeder
{
    public function run()
    {
        University::firstOrCreate([
            'name' => 'Almaaref University',
            'location' => 'Beirut, Lebanon',
            'description' => 'Almaaref University is a leading academic institution in Lebanon dedicated to providing quality education in various fields including religious studies, humanities, media, arts, law, and education.',
            'website' => 'https://mu.edu.lb',
            'email' => 'info@mu.edu.lb',
            'phone' => '+961 1 555555', // Replace with actual phone number
            'type' => 'private',
            'accreditation' => 'Ministry of Education and Higher Education, Lebanon',
            'established_year' => '2009'
        ]);

        $this->command->info('Almaaref University has been added successfully!');
    }
} 