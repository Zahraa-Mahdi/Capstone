<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUniversitiesTable extends Migration
{
    public function up()
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique()->nullable();
            $table->text('description')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('type')->nullable();
            $table->string('accreditation')->nullable();
            $table->string('established_year')->nullable();
            $table->json('study_system')->nullable();
            $table->json('contact_numbers')->nullable();
            $table->json('addresses')->nullable();
            $table->json('admission_requirements')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('universities');
    }
} 