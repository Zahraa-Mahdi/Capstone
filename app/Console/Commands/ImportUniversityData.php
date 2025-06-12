<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use App\Models\University;
use App\Models\Faculty;
use App\Models\Major;

class ImportUniversityData extends Command
{
    protected $signature = 'import:university-data';
    protected $description = 'Import universities, faculties, and majors from JSON files';

    public function handle()
    {
        // Create a default faculty for general majors
        $defaultUniversity = University::firstOrCreate(
            ['code' => 'DEFAULT'],
            [
                'name' => 'General University',
                'website' => null,
                'email' => null,
            ]
        );

        $defaultFaculty = Faculty::firstOrCreate(
            [
                'university_id' => $defaultUniversity->id,
                'name' => 'General Faculty'
            ]
        );

        // Step 1: Import unique majors
        $majorsPath = base_path('database/data/majors.json');
        if (!File::exists($majorsPath)) {
            $this->error('majors.json not found.');
            return;
        }

        $majorsData = json_decode(File::get($majorsPath), true);

        foreach ($majorsData as $majorItem) {
            Major::firstOrCreate(
                ['name' => $majorItem['name']],
                ['faculty_id' => $defaultFaculty->id]
            );
        }

        $this->info('Majors imported.');

        // Step 2: Loop through each university
        $universities = University::where('code', '!=', 'DEFAULT')->get();

        foreach ($universities as $university) {
            // Check for stored faculty data
            $facultiesDataPath = 'temp/faculties/' . $university->code . '_faculties.json';
            if (Storage::exists($facultiesDataPath)) {
                $facultiesData = json_decode(Storage::get($facultiesDataPath), true);

                if (is_array($facultiesData)) {
                    foreach ($facultiesData as $facultyData) {
                        if (isset($facultyData['name'])) {
                            $faculty = Faculty::updateOrCreate(
                                [
                                    'university_id' => $university->id,
                                    'name' => $facultyData['name']
                                ]
                            );

                            if (isset($facultyData['programs']) && is_array($facultyData['programs'])) {
                                foreach ($facultyData['programs'] as $program) {
                                    $majorName = $program['name'];
                                    $degree = $program['degree'] ?? null;
                                    
                                    // Find the major in the default faculty
                                    $major = Major::where('name', $majorName)
                                        ->where('faculty_id', $defaultFaculty->id)
                                        ->first();

                                    if ($major) {
                                        // Create a new major for this faculty
                                        Major::updateOrCreate(
                                            [
                                                'name' => $major->name,
                                                'faculty_id' => $faculty->id
                                            ],
                                            [
                                                'degree' => $degree ?? $major->degree
                                            ]
                                        );
                                    } else {
                                        // Create a new major if it doesn't exist
                                        Major::create([
                                            'name' => $majorName,
                                            'faculty_id' => $faculty->id,
                                            'degree' => $degree
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }

                // Clean up the temporary file
                Storage::delete($facultiesDataPath);
            }

            $this->info("Imported university: " . $university->name);
        }

        $this->info('Universities, faculties, and majors imported successfully.');
    }
}

        
    

