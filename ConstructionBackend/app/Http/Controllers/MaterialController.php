<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;

class MaterialController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth:api');
    // }
    public function index(Request $request)
    {
        $materials = Material::query();

        // Lấy từ khóa tìm kiếm từ request
        $search = $request->input('search', '');

        if (!empty($search)) {
            $materials->where('material_name', 'like', "%$search%");
        }

        // Thêm phân trang (số bản ghi trên mỗi trang là 10)
        $materials = $materials->latest("material_id")->paginate(10);

        return response()->json($materials, 200);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_name' => 'required|string|max:255',
            'unit' => 'required|string|max:255',
            'price' => 'required|numeric',
        ]);

        $material = Material::create($validated);

        return response()->json($material, 201);
    }

    public function show($id)
    {
        $material = Material::findOrFail($id);
        return response()->json($material, 200);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);

        $validated = $request->validate([
            'material_name' => 'sometimes|required|string|max:255',
            'unit' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
        ]);

        $material->update($validated);

        return response()->json($material, 200);
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        $material->delete();

        return response()->json(null, 204);
    }
}
