<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\University;
use App\Models\Major;
use Illuminate\Support\Facades\Log;

class UniversityController extends Controller
{
    // GET /api/universities
    public function index(Request $request)
    {
        try {
            $query = University::query();

            // Apply search filters
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where('name', 'like', "%{$search}%");
            }

            // Apply major filter
            if ($request->has('major')) {
                $major = $request->input('major');
                $query->whereHas('faculties.majors', function($q) use ($major) {
                    $q->where('name', 'like', "%{$major}%");
                });
            }

            // Apply location filter
            if ($request->has('location')) {
                $location = $request->input('location');
                $query->where(function($q) use ($location) {
                    $q->whereJsonContains('addresses', $location)
                      ->orWhereRaw("JSON_SEARCH(addresses, 'one', ?) IS NOT NULL", ["%{$location}%"]);
                });
            }

            // Apply certificate filter
            if ($request->has('certificate')) {
                $certificate = $request->input('certificate');
                $query->whereHas('faculties.majors', function($q) use ($certificate) {
                    $q->where('degree', 'like', "%{$certificate}%");
                });
            }

            // Get paginated results with relationships
            $universities = $query->with(['faculties.majors'])->paginate(9);

            // Transform the data to include faculty and program counts
            $universities->getCollection()->transform(function ($university) {
                $data = $university->toArray();
                
                // Handle addresses
                if (isset($data['addresses'])) {
                    if (is_string($data['addresses'])) {
                        $data['addresses'] = json_decode($data['addresses'], true) ?? [];
                    }
                } else {
                    $data['addresses'] = [];
                }

                // Handle degrees
                if (isset($data['degrees'])) {
                    if (is_string($data['degrees'])) {
                        $data['degrees'] = json_decode($data['degrees'], true) ?? [];
                    }
                } else {
                    $data['degrees'] = [];
                }

                return $data;
            });

            // Extract unique locations from addresses
            $locations = [];
            foreach ($universities as $university) {
                $addresses = $university['addresses'] ?? [];
                if (is_array($addresses)) {
                    foreach ($addresses as $address) {
                        if (is_string($address) && !in_array($address, $locations)) {
                            $locations[] = $address;
                        }
                    }
                }
            }

            // Get all majors from the database
            $majors = Major::orderBy('name')->pluck('name')->unique()->values()->all();

            return response()->json([
                'success' => true,
                'data' => [
                    'universities' => $universities,
                    'majors' => $majors,
                    'locations' => $locations
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load universities: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load universities'
            ], 500);
        }
    }

    // GET /api/universities/{code}
    public function show($code)
    {
        try {
            $university = University::with(['faculties.majors', 'location'])
                ->where('code', $code)
                ->firstOrFail();
            
            $data = $university->toArray();
            
            // Handle addresses
            if (isset($data['addresses'])) {
                if (is_string($data['addresses'])) {
                    $data['addresses'] = json_decode($data['addresses'], true) ?? [];
                }
            } else {
                $data['addresses'] = [];
            }

            // Handle degrees
            if (isset($data['degrees'])) {
                if (is_string($data['degrees'])) {
                    $data['degrees'] = json_decode($data['degrees'], true) ?? [];
                }
            } else {
                $data['degrees'] = [];
            }

            // Handle study system
            if (isset($data['study_system'])) {
                if (is_string($data['study_system'])) {
                    $data['study_system'] = json_decode($data['study_system'], true) ?? [];
                }
            } else {
                $data['study_system'] = [];
            }

            // Handle contact numbers
            if (isset($data['contact_numbers'])) {
                if (is_string($data['contact_numbers'])) {
                    $data['contact_numbers'] = json_decode($data['contact_numbers'], true) ?? [];
                }
            } else {
                $data['contact_numbers'] = [];
            }

            // Handle admission requirements
            if (isset($data['admission_requirements'])) {
                if (is_string($data['admission_requirements'])) {
                    $data['admission_requirements'] = json_decode($data['admission_requirements'], true) ?? [];
                }
            } else {
                $data['admission_requirements'] = [];
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('University not found: ' . $code);
            return response()->json([
                'success' => false,
                'message' => 'University not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to load university: ' . $e->getMessage(), [
                'code' => $code,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to load university details'
            ], 500);
        }
    }

    // POST /api/universities
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|unique:universities,code',
                'degrees' => 'nullable|json',
                'addresses' => 'nullable|array',
            ]);

            $university = University::create($validated);

            return response()->json([
                'success' => true,
                'data' => $university,
                'message' => 'University created successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create university: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create university'
            ], 500);
        }
    }
}
