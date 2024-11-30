<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\RevenueExpenditure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Contracts\Providers\Auth;

class RevenueExpenditureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $date = Carbon::parse($request->search)->format('Y-m-d');
            $data = RevenueExpenditure::with('user')->whereDate('created_at', $date)->latest('id')->get();

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
    public function destroy(Request $request, $id)
    {

        DB::beginTransaction();
        try {
            $data = RevenueExpenditure::findOrFail($id);

            $data->delete();

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete purchase', 'message' => $e->getMessage()], 500);
        }
    }
}
