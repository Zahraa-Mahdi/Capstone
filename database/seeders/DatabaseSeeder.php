<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Use a secure password
            'role' => 'admin',
        ]);

        // Create a normal User
        User::create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'), // Use a secure password
            'role' => 'user',
        ]);

        $this->call([
            MajorSeeder::class,
            UniversityStructureSeeder::class,
        ]);
    }
}
