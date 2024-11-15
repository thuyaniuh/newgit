<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        // Bắt đầu truy vấn nhà cung cấp
        $suppliers = Supplier::query();

        // Lấy các tham số tìm kiếm từ request
        $search = $request->input('search');
        $phoneNumber = $request->input('phoneNumber');

        // Thêm điều kiện tìm kiếm theo tên nhà cung cấp nếu có
        if (!empty($search)) {
            $suppliers->where('supplier_name', 'like', "%$search%");
        }

        // Thêm điều kiện tìm kiếm theo số điện thoại nếu có
        if (!empty($phoneNumber)) {
            $suppliers->where('phone', 'like', "%$phoneNumber%");
        }

        // Phân trang kết quả, mỗi trang hiển thị 10 kết quả
        $suppliers = $suppliers->latest('supplier_id')->paginate(10);

        // Trả về JSON cho client với các nhà cung cấp và thông tin phân trang
        return response()->json($suppliers, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_name' => 'required|string|max:255|unique:suppliers,supplier_name',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|unique:suppliers,phone|regex:/^0[0-9]{9}$/',
        ]);

        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    public function show($id)
    {
        $supplier = Supplier::findOrFail($id);
        return response()->json($supplier, 200);
    }

    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        $validated = $request->validate([
            'supplier_name' => 'sometimes|required|string|max:255|unique:suppliers,supplier_name,' . $id . ',supplier_id',
            'address' => 'sometimes|required|string|max:500',
            'phone' => 'sometimes|required|string|unique:suppliers,phone,' . $id . ',supplier_id|regex:/^0[0-9]{9}$/',
        ]);

        $supplier->update($validated);

        return response()->json($supplier, 200);
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(null, 204);
    }
}
