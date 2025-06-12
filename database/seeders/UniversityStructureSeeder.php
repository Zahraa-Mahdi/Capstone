<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\Faculty;
use App\Models\Major;
use Illuminate\Support\Str;

class UniversityStructureSeeder extends Seeder
{
    public function run()
    {
        // Get all available majors
        $availableMajors = MajorSeeder::getMajorsData();
        
        // Define university structure
        $universities = [
            [
                'name' => 'Almaaref University',
                'code' => 'MU',
                'description' => 'Almaaref University is a leading academic institution in Lebanon dedicated to providing quality education in various fields.',
                'website' => 'https://mu.edu.lb',
                'email' => 'info@mu.edu.lb',
                'phone' => '+961 1 555555',
                'type' => 'private',
                'accreditation' => 'Ministry of Education and Higher Education, Lebanon',
                'established_year' => '2009',
                'study_system' => json_encode(['Semester', 'Credit Hours']),
                'contact_numbers' => json_encode(['+961 1 555555', '+961 1 555556']),
                'addresses' => json_encode(['Main Campus: Beirut, Lebanon']),
                'admission_requirements' => json_encode([
                    'Lebanese Baccalaureate or equivalent',
                    'English language proficiency',
                    'Entrance exam',
                    'Personal interview'
                ]),
                'faculties' => [
                    [
                        'name' => 'Faculty of Religious Studies',
                        'majors' => ['Islamic Studies', 'Comparative Religions', 'Quranic Studies', 'Islamic Law (Sharia)', 'Islamic Theology']
                    ],
                    [
                        'name' => 'Faculty of Literature and Humanities',
                        'majors' => ['Arabic Language and Literature', 'English Language and Literature', 'History', 'Philosophy', 'Psychology', 'Sociology']
                    ],
                    [
                        'name' => 'Faculty of Media',
                        'majors' => ['Journalism', 'Digital Media', 'Public Relations', 'Broadcasting', 'Media Production']
                    ],
                    [
                        'name' => 'Faculty of Arts',
                        'majors' => ['Graphic Design', 'Interior Design', 'Visual Communication', 'Digital Arts', 'Animation']
                    ],
                    [
                        'name' => 'Faculty of Law',
                        'majors' => ['Law', 'International Law', 'Business Law', 'Criminal Law', 'Civil Law']
                    ],
                    [
                        'name' => 'Faculty of Education',
                        'majors' => ['Education', 'Early Childhood Education', 'Special Education', 'Educational Psychology', 'Curriculum and Instruction']
                    ]
                ]
            ]
            // Add more universities here as needed
        ];

        foreach ($universities as $universityData) {
            $faculties = $universityData['faculties'];
            unset($universityData['faculties']);

            $university = University::firstOrCreate(
                ['name' => $universityData['name']],
                $universityData
            );

            foreach ($faculties as $facultyData) {
                $faculty = Faculty::firstOrCreate(
                    [
                        'university_id' => $university->id,
                        'name' => $facultyData['name']
                    ]
                );

                foreach ($facultyData['majors'] as $majorName) {
                    // Create the major if it doesn't exist
                    $major = Major::firstOrCreate(
                        ['name' => $majorName],
                        [
                            'name' => $majorName,
                            'faculty_id' => $faculty->id
                        ]
                    );

                    // If the major exists but isn't associated with this faculty, update it
                    if ($major->faculty_id !== $faculty->id) {
                        $major->update(['faculty_id' => $faculty->id]);
                    }
                }
            }
        }

        $this->command->info('Universities structure seeded successfully!');
    }
} 