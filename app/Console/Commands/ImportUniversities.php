<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\University;
use Illuminate\Support\Facades\Storage;

class ImportUniversities extends Command
{
    protected $signature = 'import:universities';
    protected $description = 'Import universities from JSON files';

    public function handle()
    {
        $directory = storage_path('app/universities');
        $files = glob($directory . '/*.json');

        foreach ($files as $filePath) {
            $json = file_get_contents($filePath);
            $data = json_decode($json, true);

            if (!$data || !isset($data['university'])) {
                $this->error("❌ Invalid JSON in file: " . basename($filePath));
                continue;
            }

            $uniData = $data['university'];

            if (!isset($uniData['name'], $uniData['code'])) {
                $this->error("❌ Missing 'name' or 'code' in file: " . basename($filePath));
                continue;
            }

            $this->info('🔍 Importing university: ' . $uniData['code']);

            try {
                // Transform the data into the new format
                $transformedData = [
                    'code' => $uniData['code'],
                    'name' => $uniData['name'],
                    'website' => $uniData['website'] ?? null,
                    'email' => $uniData['email'] ?? null,
                    'image' => $uniData['image'] ?? null,
                ];

                // Handle contact numbers
                $transformedData['contact_numbers'] = isset($uniData['main_campus']['phone_numbers']) 
                    ? $uniData['main_campus']['phone_numbers'] 
                    : [];

                // Handle addresses
                if (isset($uniData['main_campus']['location'])) {
                    $transformedData['addresses'] = [$uniData['main_campus']['location']];
                } elseif (isset($uniData['location']['address'])) {
                    $transformedData['addresses'] = [$uniData['location']['address']];
                } else {
                    $transformedData['addresses'] = [];
                }

                // Handle study system
                $transformedData['study_system'] = [
                    'instruction_languages' => ['English'],
                    'study_modes' => ['Credit Hour System']
                ];

                // Handle admission requirements
                $admissionRequirements = [
                    'undergraduate' => [
                        'academic_qualifications' => [],
                        'language_requirements' => [
                            'english_proficiency' => [
                                'TOEFL' => 'Required for non-native speakers',
                                'IELTS' => 'Required for non-native speakers'
                            ]
                        ],
                        'placement_tests' => [
                            'required' => true,
                            'subjects' => ['SAT']
                        ],
                        'required_documents' => [
                            'High school diploma or equivalent',
                            'Personal statement',
                            'Letters of recommendation'
                        ],
                        'application_process' => [
                            'online_submission' => true,
                            'steps' => [
                                'Submit online application',
                                'Submit required documents',
                                'Take placement tests',
                                'Interview (if required)'
                            ]
                        ],
                        'intake_periods' => [
                            'fall' => 'September',
                            'spring' => 'January'
                        ]
                    ]
                ];

                // Store faculty and program data for later use by import:university-data
                if (isset($uniData['faculties']) && is_array($uniData['faculties'])) {
                    $facultiesData = [];
                    foreach ($uniData['faculties'] as $faculty) {
                        if (isset($faculty['name'])) {
                            $programs = [];
                            
                            // Handle programs array
                            if (isset($faculty['programs']) && is_array($faculty['programs'])) {
                                foreach ($faculty['programs'] as $program) {
                                    if (is_array($program)) {
                                        $programs[] = [
                                            'name' => $program['name'],
                                            'degree' => $program['degree'],
                                            'duration' => $this->getDurationForDegree($program['degree'])
                                        ];
                                    } else {
                                        $programs[] = [
                                            'name' => $program,
                                            'degree' => 'Bachelor',
                                            'duration' => $this->getDurationForDegree('Bachelor')
                                        ];
                                    }
                                }
                            }
                            // Handle majors array (old format)
                            elseif (isset($faculty['majors']) && is_array($faculty['majors'])) {
                                foreach ($faculty['majors'] as $major) {
                                    $degreeType = $this->extractDegreeType($major);
                                    $programs[] = [
                                        'name' => str_replace(" ({$degreeType})", '', $major),
                                        'degree' => $degreeType,
                                        'duration' => $this->getDurationForDegree($degreeType)
                                    ];
                                }
                            }
                            
                            if (!empty($programs)) {
                                $facultiesData[] = [
                                    'name' => $faculty['name'],
                                    'programs' => $programs
                                ];
                            }
                        }
                    }

                    // Store faculties data in a temporary file
                    if (!empty($facultiesData)) {
                        Storage::put(
                            'temp/faculties/' . $uniData['code'] . '_faculties.json',
                            json_encode($facultiesData, JSON_PRETTY_PRINT)
                        );
                    }
                }

                // Encode arrays as JSON
                $transformedData['contact_numbers'] = json_encode($transformedData['contact_numbers']);
                $transformedData['addresses'] = json_encode($transformedData['addresses']);
                $transformedData['study_system'] = json_encode($transformedData['study_system']);
                $transformedData['admission_requirements'] = json_encode($admissionRequirements);

                University::updateOrCreate(
                    ['code' => $transformedData['code']],
                    $transformedData
                );

                $this->info('✅ Successfully imported: ' . $uniData['name']);
            } catch (\Exception $e) {
                $this->error('❌ Failed to import ' . $uniData['name'] . ': ' . $e->getMessage());
                // Log more details about the error
                $this->error('Error details: ' . json_encode([
                    'file' => basename($filePath),
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ], JSON_PRETTY_PRINT));
            }
        }

        $this->info('🎉 Import completed!');
    }

    private function extractDegreeType($major)
    {
        if (preg_match('/\((.*?)\)$/', $major, $matches)) {
            return $matches[1];
        }
        return 'Bachelor'; // Default to Bachelor if no degree type is specified
    }

    private function getDurationForDegree($degree)
    {
        switch ($degree) {
            case 'Bachelor':
            case 'BS':
            case 'BA':
            case 'BBA':
            case 'BE':
            case 'BArch':
                return '4 years';
            case 'Master':
            case 'MS':
            case 'MA':
            case 'MBA':
            case 'MPH':
                return '2 years';
            case 'PhD':
            case 'Doctorate':
                return 'Variable';
            case 'Diploma':
                return '1 year';
            case 'Certificate':
                return 'Variable';
            default:
                return 'Variable';
        }
    }
}
