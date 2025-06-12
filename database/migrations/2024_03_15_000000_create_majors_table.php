<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMajorsTable extends Migration
{
    public function up()
    {
        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('degree')->nullable();
            $table->foreignId('faculty_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('majors');
    }
} 