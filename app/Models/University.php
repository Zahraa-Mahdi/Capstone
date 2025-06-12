<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    protected $fillable = [
        'code',
        'name',
        'website',
        'email',
        'study_system',
        'contact_numbers',
        'addresses',
        'admission_requirements',
        'degrees',
        'image'
    ];

    protected $casts = [
        'contact_numbers' => 'json',
        'addresses' => 'json',
        'admission_requirements' => 'json',
        'degrees' => 'json'
    ];

    public function majors()
    {
        return $this->hasMany(Major::class);
    }

    public function location()
    {
        return $this->hasOne(Location::class);
    }

    public function faculties()
    {
        return $this->hasMany(Faculty::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }
}
