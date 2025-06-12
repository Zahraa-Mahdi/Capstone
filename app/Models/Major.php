<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'degree',
        'faculty_id'
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function university()
    {
        return $this->hasOneThrough(University::class, Faculty::class);
    }
}
