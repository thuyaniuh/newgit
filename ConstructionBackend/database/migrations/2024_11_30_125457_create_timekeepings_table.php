<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timekeepings', function (Blueprint $table) {
            $table->id();

            $table->integer('project_user_id')->unsigned()->index();
            $table->integer('status');
            $table->string('money');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timekeepings');
    }
};
