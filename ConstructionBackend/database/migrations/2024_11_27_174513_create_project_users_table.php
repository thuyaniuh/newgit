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
        Schema::create('project_users', function (Blueprint $table) {
            $table->id();

            $table->integer('user_id')->unsigned()->index();
            // $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');

            $table->integer('project_id')->unsigned()->index();
            // $table->foreign('project_id')->references('project_id')->on('projects')->onDelete('cascade');

            $table->timestamps();
        });

        Schema::create('revenue_expenditure', function (Blueprint $table) {
            $table->id();
            $table->string('images')->nullable();
            $table->integer('type_re')->default(0);
            $table->text('note')->nullable();
            $table->string('money')->default(0);
            $table->integer('user_id')->unsigned()->index();
            // $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_users');
        Schema::dropIfExists('revenue_expenditure');
    }
};
