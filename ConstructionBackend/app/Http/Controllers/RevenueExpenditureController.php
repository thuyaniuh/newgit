<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\RevenueExpenditure;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Contracts\Providers\Auth;

class RevenueExpenditureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = RevenueExpenditure::get();

            return response()->json($data, 200);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json($e, 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $avatarPath = null;
            if ($request->hasFile('images')) {
                $avatarPath = $request->file('images')->store('images', 'public');
            }
            $data = [
                'user_id' => $request->user_id,
                'type_re' => $request->type_re,
                'note' => $request->note,
                'money' => $request->money,
            ];
            if (!empty($avatarPath)) {
                $data['images'] = $avatarPath;
            }
            $data = RevenueExpenditure::create($data);

            return response()->json($data, 201);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json($e, 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RevenueExpenditure $revenueExpenditure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RevenueExpenditure $revenueExpenditure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RevenueExpenditure $revenueExpenditure)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RevenueExpenditure $revenueExpenditure)
    {
        //
    }
}
