<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('query');

        $purchases = Purchase::with(['materials.material', 'images', 'project', 'supplier', 'user'])
            ->when($query, function ($q) use ($query) {
                $q->whereHas('project', function ($projectQuery) use ($query) {
                    $projectQuery->where('name', 'like', '%' . $query . '%');
                })->orWhereHas('supplier', function ($supplierQuery) use ($query) {
                    $supplierQuery->where('supplier_name', 'like', '%' . $query . '%');
                })->orWhereHas('user', function ($userQuery) use ($query) {
                    $userQuery->where('name', 'like', '%' . $query . '%');
                })->orWhere('date', 'like', '%' . $query . '%');
            })
            ->get();
        return response()->json($purchases, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'supplier_id' => 'required|exists:suppliers,supplier_id',
            'user_id' => 'required|exists:users,user_id',
            'date' => 'required|date',
            'materials' => 'required|array',
            'materials.*.material_id' => 'required|exists:materials,material_id',
            'materials.*.quantity' => 'required|numeric',
            'materials.*.price' => 'required|numeric',
            'images' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'additional_cost' => 'nullable|numeric',
        ]);

        DB::beginTransaction();
        try {
            $purchase = Purchase::create([
                'project_id' => $validated['project_id'],
                'supplier_id' => $validated['supplier_id'],
                'user_id' => $validated['user_id'],
                'date' => $validated['date'],
                'additional_cost' => $validated['additional_cost'] ?? 0,
            ]);

            // Tính tổng tiền và thêm vật tư
            $totalPrice = 0;
            foreach ($validated['materials'] as $materialData) {
                $materialTotal = $materialData['quantity'] * $materialData['price'];
                $totalPrice += $materialTotal;
                $purchase->materials()->create($materialData);
            }

            // Thêm chi phí phát sinh vào tổng giá
            $totalPrice += $purchase->additional_cost;
            $purchase->update(['total_price' => $totalPrice]);

            // Lưu ảnh hóa đơn nếu có
            if ($request->has('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('purchase_receipts', 'public');
                    $purchase->images()->create(['image_path' => $path]);
                }
            }

            DB::commit();
            return response()->json($purchase->load('materials', 'images'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create purchase', 'message' => $e->getMessage()], 500);
        }
    }


    public function show($id)
    {
        $purchase = Purchase::with(['materials.material', 'images', 'project', 'supplier', 'user'])->findOrFail($id);
        return response()->json($purchase, 200);
    }

    public function update(Request $request, $id)
    {
        $purchase = Purchase::findOrFail($id);

        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,project_id',
            'supplier_id' => 'sometimes|required|exists:suppliers,supplier_id',
            'user_id' => 'sometimes|required|exists:users,user_id',
            'date' => 'sometimes|required|date',
            'materials' => 'array',
            'materials.*.material_id' => 'required|exists:materials,material_id',
            'materials.*.quantity' => 'required|numeric',
            'materials.*.price' => 'required|numeric',
            'additional_cost' => 'nullable|numeric',
            'additional_cost_note' => 'nullable|string',
            'images' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $purchase->update([
                'project_id' => $validated['project_id'] ?? $purchase->project_id,
                'supplier_id' => $validated['supplier_id'] ?? $purchase->supplier_id,
                'user_id' => $validated['user_id'] ?? $purchase->user_id,
                'date' => $validated['date'] ?? $purchase->date,
                'additional_cost' => $validated['additional_cost'] ?? $purchase->additional_cost,
                'additional_cost_note' => $validated['additional_cost_note'] ?? $purchase->additional_cost_note,
            ]);

            if (isset($validated['materials'])) {
                $purchase->materials()->delete();
                $totalPrice = $validated['additional_cost'] ?? 0;

                foreach ($validated['materials'] as $materialData) {
                    $materialTotal = $materialData['quantity'] * $materialData['price'];
                    $totalPrice += $materialTotal;

                    $purchase->materials()->create([
                        'material_id' => $materialData['material_id'],
                        'quantity' => $materialData['quantity'],
                        'price' => $materialData['price'],
                    ]);
                }

                $purchase->update(['total_price' => $totalPrice]);
            }

            if ($request->has('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('purchase_receipts', 'public');
                    $purchase->images()->create(['image_path' => $path]);
                }
            }

            DB::commit();
            return response()->json($purchase->load('materials.material', 'images'), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update purchase', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $purchase = Purchase::findOrFail($id);

        DB::beginTransaction();
        try {
            $purchase->materials()->delete();
            $purchase->images()->delete();
            $purchase->delete();

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete purchase', 'message' => $e->getMessage()], 500);
        }
    }
}
