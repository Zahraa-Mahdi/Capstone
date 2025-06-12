<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\Faculty;
use App\Models\Major;

class AlmaarefMajorsSeeder extends Seeder
{
    public function run()
    {
        // Find Almaaref University
        $university = University::where('name', 'like', '%Almaaref%')->first();

        if (!$university) {
            $this->command->error('Almaaref University not found!');
            return;
        }

        // Define faculties and their majors
        $facultiesWithMajors = [
            'Faculty of Religious Studies' => [
                'Islamic Studies',
                'Comparative Religions',
                'Quranic Studies',
                'Islamic Law (Sharia)',
                'Islamic Theology'
            ],
            'Faculty of Literature and Humanities' => [
                'Arabic Language and Literature',
                'English Language and Literature',
                'History',
                'Philosophy',
                'Psychology',
                'Sociology'
            ],
            'Faculty of Media' => [
                'Journalism',
                'Digital Media',
                'Public Relations',
                'Broadcasting',
                'Media Production'
            ],
            'Faculty of Arts' => [
                'Graphic Design',
                'Interior Design',
                'Visual Communication',
                'Digital Arts',
                'Animation'
            ],
            'Faculty of Law' => [
                'Law',
                'International Law',
                'Business Law',
                'Criminal Law',
                'Civil Law'
            ],
            'Faculty of Education' => [
                'Education',
                'Early Childhood Education',
                'Special Education',
                'Educational Psychology',
                'Curriculum and Instruction'
            ]
        ];

        foreach ($facultiesWithMajors as $facultyName => $majors) {
            // Find or create faculty
            $faculty = Faculty::firstOrCreate(
                [
                    'university_id' => $university->id,
                    'name' => $facultyName
                ]
            );

            // Add majors to the faculty
            foreach ($majors as $majorName) {
                $major = Major::firstOrCreate(['name' => $majorName]);
                
                // Check if major is already associated with faculty
                if (!$faculty->majors()->where('name', $majorName)->exists()) {
                    $faculty->majors()->attach($major->id);
                }
            }
        }

        $this->command->info('Almaaref University majors have been added successfully!');
    }
} 