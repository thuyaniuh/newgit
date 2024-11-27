<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueExpenditure extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id', // người tạo
        'type_re', // loại thu hay chi
        'note', // ghi chú
        'money', // ghi chú
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class, 'purchase_id');
    }
}
