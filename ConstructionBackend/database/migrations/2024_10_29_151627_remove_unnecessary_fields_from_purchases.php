<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveUnnecessaryFieldsFromPurchases extends Migration
{
    public function up()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn(['material_id', 'quantity', 'price']);
        });
    }

    public function down()
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->foreignId('material_id')->nullable()->constrained('materials');
            $table->integer('quantity')->nullable();
            $table->decimal('price', 10, 2)->nullable();
        });
    }
}
