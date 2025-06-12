<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\Faculty;
use App\Models\Major;

class UniversitySeeder extends Seeder
{
    public function run()
    {
        // Create a test university
        $university = University::create([
            'name' => 'Test University',
            'code' => 'TEST-' . time(), // Use timestamp to ensure unique code
            'website' => 'https://test-university.edu',
            'email' => 'info@test-university.edu',
            'study_system' => json_encode([
                'instruction_languages' => ['English'],
                'study_modes' => ['Credit Hour System']
            ]),
            'contact_numbers' => json_encode(['123-456-7890']),
            'addresses' => json_encode(['123 University St, Test City']),
            'admission_requirements' => json_encode([
                'undergraduate' => [
                    'minimum_gpa' => '2.5',
                    'required_documents' => [
                        'High School Transcript',
                        'ID Card',
                        'Passport Photos'
                    ],
                    'language_requirements' => [
                        'TOEFL' => 'iBT 80 or higher',
                        'IELTS' => '6.0 or higher'
                    ],
                    'intake_periods' => [
                        'fall' => 'September',
                        'spring' => 'February'
                    ]
                ]
            ])
        ]);

        // Create faculties with majors
        $faculties = [
            'Faculty of Engineering' => [
                'Computer Engineering',
                'Civil Engineering',
                'Mechanical Engineering'
            ],
            'Faculty of Business' => [
                'Business Administration',
                'Marketing',
                'Finance'
            ],
            'Faculty of Science' => [
                'Computer Science',
                'Mathematics',
                'Physics'
            ]
        ];

        foreach ($faculties as $facultyName => $majors) {
            $faculty = Faculty::create([
                'university_id' => $university->id,
                'name' => $facultyName
            ]);

            foreach ($majors as $majorName) {
                Major::create([
                    'faculty_id' => $faculty->id,
                    'name' => $majorName,
                    'degree' => 'Bachelor'
                ]);
            }
        }
    }
} 