<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueExpenditure extends Model
{
    use HasFactory;

    protected $table = "revenue_expenditure";

    protected $fillable = [
        'id',
        'user_id', // người tạo
        'type_re', // loại thu hay chi
        'note', // ghi chú
        'money', // số tiền
        'images', // ảnh chứng từ
        'type_trans', // ảnh chứng từ
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
