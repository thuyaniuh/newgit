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
        Schema::table('purchases', function (Blueprint $table) {
            //
            $table->decimal('additional_cost', 15, 2)->nullable()->after('total_price')->comment('Chi phí phát sinh như tiền vận chuyển');
            $table->string('additional_cost_note')->nullable()->after('additional_cost')->comment('Ghi chú cho chi phí phát sinh');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            //

            $table->dropColumn('additional_cost');
            $table->dropColumn('additional_cost_note');
        });
    }
};
