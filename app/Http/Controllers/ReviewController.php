<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class ReviewController extends Controller
{
    public function index()
    {
        return Review::with('user')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5'
        ]);

        $review = new Review();
        $review->content = $validated['content'];
        $review->rating = $validated['rating'];
        $review->user_id = Auth::id();
        $review->save();

        return response()->json($review->load('user'), 201);
    }
} 