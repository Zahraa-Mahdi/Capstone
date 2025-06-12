<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;  // Important!
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's favorite universities.
     */
    public function favoriteUniversities(): BelongsToMany
    {
        return $this->belongsToMany(University::class, 'favorites')
            ->withTimestamps();
    }

    /**
     * Get all favorites of the user.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
