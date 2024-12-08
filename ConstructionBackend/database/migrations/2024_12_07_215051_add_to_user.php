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
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp')->nullable();
            $table->integer('active')->default(0);
        });

        Schema::table('revenue_expenditure', function (Blueprint $table) {
            $table->integer('type_trans')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('otp');
            $table->dropColumn('active');
        });

        Schema::table('revenue_expenditure', function (Blueprint $table) {
            $table->dropColumn('type_trans');
        });
    }
};
