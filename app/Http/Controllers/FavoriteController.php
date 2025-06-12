<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Toggle favorite status for a university.
     */
    public function toggle(Request $request, $universityCode): JsonResponse
    {
        $university = University::where('code', $universityCode)->firstOrFail();
        $user = $request->user();
        $favorite = $user->favorites()->where('university_id', $university->id)->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'University removed from favorites',
                'is_favorite' => false
            ]);
        }

        $user->favorites()->create([
            'university_id' => $university->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'University added to favorites',
            'is_favorite' => true
        ]);
    }

    /**
     * Get user's favorite universities.
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()
            ->favoriteUniversities()
            ->with(['location'])
            ->get();

        return response()->json([
            'status' => 'success',
            'favorites' => $favorites
        ]);
    }

    /**
     * Check if a university is favorited by the user.
     */
    public function check(Request $request, $universityCode): JsonResponse
    {
        $university = University::where('code', $universityCode)->firstOrFail();
        $isFavorite = $request->user()
            ->favorites()
            ->where('university_id', $university->id)
            ->exists();

        return response()->json([
            'is_favorite' => $isFavorite
        ]);
    }
} 