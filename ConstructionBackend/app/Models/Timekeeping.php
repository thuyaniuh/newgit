<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timekeeping extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_user_id',
        'status',
        'money',
    ];
}
