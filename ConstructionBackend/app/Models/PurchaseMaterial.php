<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_id', // Tên khóa ngoại chính xác
        'material_id',
        'material_name',
        'unit',
        'quantity',
        'price',
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class, 'purchase_id'); // Đặt tên cột khóa ngoại đúng
    }

    public function material()
    {
        return $this->belongsTo(Material::class, 'material_id');
    }
}
