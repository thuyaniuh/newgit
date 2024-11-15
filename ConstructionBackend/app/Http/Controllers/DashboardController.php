<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Supplier;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getCounts()
    {
        $countUsers = User::count();
        $countProjects = Project::count();
        $countSuppliers = Supplier::count();

        return response()->json([
            'countUsers' => $countUsers,
            'countProjects' => $countProjects,
            'countSuppliers' => $countSuppliers,
        ], 200);
    }
}

