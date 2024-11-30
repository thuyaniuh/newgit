<?php

namespace App\Http\Controllers;

use App\Models\ProjectUser;
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
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('user_id', 'like', "%{$search}%");
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
            'birth' => Carbon::parse($request->input('birth')),
            'phone' => $request->input('phone', ''),
        ]);

        return response()->json($user, 201);
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

            if(!empty($request->type)) {
                $data = ProjectUser::where('user_id', $id)->where('project_id', $request->type)->first();
                Log::info($data);
                if(empty($data)) {
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
}
