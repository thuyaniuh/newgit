<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\Timekeeping;
use Exception;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth:api');
    // }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query()->with('projects');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        if (!empty($request->user_id) && $request->user_id != 0) {
            Log::info($request->user_id);
            $query = $query->where('user_id', $request->user_id);
        }

        $users = $query->latest('user_id')->paginate(8);
        // $users->map(function ($user) {
        //     if ($user->avatar) {
        //         $user->avatar_url = asset('storage/' . $user->avatar);
        //     }
        //     return $user;
        // });

        //
        Log::info($users);

        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info(request()->all());

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'active_status' => 'required|in:active,locked',
            ]);

            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'active_status' => $validated['active_status'],
                'avatar' => $avatarPath,
                'role' =>  $request->role,
                'birth' => Carbon::parse($request->input('birth')),
                'phone' => $request->input('phone', ''),
            ]);
            Log::info($user);

            return response()->json($user, 200);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json($e, 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        if ($user->avatar) {
            $user->avatar_url = asset('storage/' . $user->avatar);
        }
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Log::info($request->all());
            // $user = User::findOrFail($id);
            $user = User::where('user_id', $id)->first();

            // $validated = $request->validate([
            //     'name' => 'sometimes|required|string|max:255',
            //     'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            //     // 'password' => 'sometimes|required|string|min:8',
            //     // 'active_status' => 'required|in:active,locked',
            //     // 'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            // ]);

            // if ($request->hasFile('avatar')) {
            //     if ($user->avatar) {
            //         Storage::disk('public')->delete($user->avatar);
            //     }
            //     $avatarPath = $request->file('avatar')->store('avatars', 'public');
            //     $user->avatar = $avatarPath;
            // }

            // if (isset($validated['password'])) {
            //     $validated['password'] = Hash::make($validated['password']);
            // }

            $user->update([
                "name" => $request->name,
                "email" => $request->email,
            ]);

            if (!empty($request->type)) {
                $data = ProjectUser::where('user_id', $id)->where('project_id', $request->type)->first();
                Log::info($data);
                if (empty($data)) {
                    ProjectUser::create([
                        "project_id" => $request->type,
                        "user_id" => $id,
                    ]);
                }
            }

            return response()->json($user, 200);
        } catch (Exception $e) {

            Log::info($e);
            return response()->json($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    public function times($id)
    {
        $data = Timekeeping::join('project_users', 'project_users.id', 'timekeepings.project_user_id')
            ->join('projects', 'projects.project_id', 'project_users.project_id')
            ->select(['timekeepings.*', 'project_users.user_id', 'projects.name'])
            ->where('project_users.user_id', $id)
            ->latest('timekeepings.id')
            ->get();

        $money = Timekeeping::join('project_users', 'project_users.id', 'timekeepings.project_user_id')
            ->join('projects', 'projects.project_id', 'project_users.project_id')->whereMonth('timekeepings.created_at', Carbon::now()->month)
            ->whereYear('timekeepings.created_at', Carbon::now()->year)
            ->where('timekeepings.status', '!=', 3)
            ->where('project_users.user_id', $id)
            ->sum('timekeepings.money');

        Log::info($data);

        return response()->json([
            "data" => $data,
            "money" => $money,
        ], 200);
    }

    public function time(Request $request)
    {
        try {
            $user = User::where('user_id', $request->user_id)->first();
            $project = Project::where('project_id', $request->project_id)->first();

            $project_user = ProjectUser::where('user_id', $request->user_id)->where('project_id', $request->project_id)->first();

            if ($user->role == "worker") {
                $money = 200000;
            } else {
                $money = 400000;
            }

            if ($request->status == 2) {
                $money -= 50000;
            } elseif ($request->status == 3) {
                $money = 0;
            }

            $data = Timekeeping::where('project_user_id', $project_user->id)->whereDate('created_at', Carbon::now()->format('Y-m-d'))->first();

            if (!empty($data)) {
                return response()->json([
                    "success" => "Đã chấm công từ trước rồi"
                ], 201);
            }

            Timekeeping::create([
                "project_user_id" => $project_user->id,
                "status" => $request->status,
                "money" => $money,
            ]);

            return response()->json([
                "success" => "Đã chấm công thành công"
            ], 201);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }
}
