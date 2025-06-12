<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Major;

class MajorController extends Controller
{
    public function index()
    {
        $majors = Major::all();

        return response()->json([
            'status' => 'success',
            'data' => $majors,
        ]);
    }
}
