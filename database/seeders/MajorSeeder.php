<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Major;
use Illuminate\Support\Facades\File;

class MajorSeeder extends Seeder
{
    public static function getMajorsData()
    {
        $jsonPath = database_path('data/majors.json');
        return json_decode(File::get($jsonPath), true) ?? [];
    }

    public function run()
    {
        // Skip direct seeding of majors since they should be created through faculty associations
        $this->command->info('Majors data loaded successfully!');
    }
} 