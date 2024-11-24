<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function __construct()
    // {
    //     $this->middleware('auth:api');
    // }

    public function index(Request $request)
    {
        Log::info("index");
        // Lấy từ khóa tìm kiếm từ query string
        $search = $request->input('query', '');

        // Lấy số lượng kết quả mỗi trang (mặc định là 10)
        $perPage = $request->input('per_page', 10);

        // Thực hiện tìm kiếm và phân trang
        $projects = Project::when($search, function ($query, $search) {
            return $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        })
            ->latest()
            ->paginate($perPage);

        return response()->json($projects, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        Log::info("store");
        try {
            $validated = $request->validate([
                'budget' => 'required',
                'name' => 'required',
                'type' => 'required|in:"Xây dựng","Thiết kế"',
                'description' => 'required|string|max:500',
                'start_day' => 'required|date',
                'end_day' => 'required|date',
                'status' => 'required|in:active,completed',
            ]);

            Log::info(request()->all());

            if (Carbon::parse($request->start_day)->greaterThanOrEqualTo(Carbon::parse($request->end_day))) {
                return response()->json(["data" => "start date không được nhỏ hơn end date"], 500);
            }

            $project = Project::create($validated);

            return response()->json($project, 201);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::where('project_id', $id)->firstOrFail();
        return response()->json($project, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|required|in:"Xây dựng","Thiết kế"',
            'description' => 'sometimes|required|string|max:500',
            'start_day' => 'sometimes|required|date',
            'end_day' => 'sometimes|required|date',
            'status' => 'required|in:active,completed',
        ]);

        $project->update($validated);

        return response()->json($project, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(null, 204);
    }
}
