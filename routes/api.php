<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UniversityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\MajorController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;

// Public routes
Route::get('/universities', [UniversityController::class, 'index']);
Route::get('/universities/{code}', [UniversityController::class, 'show']);
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/majors', [MajorController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);

// Authentication routes
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisteredUserController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Favorites
    Route::post('/favorites/toggle/{universityCode}', [FavoriteController::class, 'toggle']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::get('/favorites/check/{universityCode}', [FavoriteController::class, 'check']);

    // Reviews - only POST needs auth
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/logout', [LoginController::class, 'logout']);
});

Route::get('/hello', function () {
    return response()->json(['message' => 'Hello from Laravel backend!']);
});
