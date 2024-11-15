<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $primaryKey = 'purchase_id';

    protected $fillable = [
        'project_id',
        'supplier_id',
        'user_id',
        'date',
        'total_price',
        'additional_cost',
        'additional_cost_note',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function materials()
    {
        return $this->hasMany(PurchaseMaterial::class, 'purchase_id');
    }

    public function images()
    {
        return $this->hasMany(PurchaseImage::class, 'purchase_id');
    }
}
