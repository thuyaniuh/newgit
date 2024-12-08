<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use Twilio\Rest\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'otp']]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (empty($user) || $user->active == 0) {
            return response()->json(['error' => 'Unauthorized'], 500);
        }

        if (!$token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|string|email|max:100|unique:users',
                'password' => [
                    'required',
                    'string',
                    'min:6', // Ít nhất 6 ký tự
                    'regex:/[A-Z]/', // Ít nhất một chữ hoa
                    'regex:/[a-z]/', // Ít nhất một chữ thường
                    'regex:/[0-9]/', // Ít nhất một số
                    'regex:/[@$!%*?&]/', // Ít nhất một ký tự đặc biệt
                    'confirmed'
                ],
                // 'birth' => 'required|date' // Thêm xác thực cho ngày sinh
            ]);

            Log::info($request->all());

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            Log::info(config('app.TWILIO_SID') . '----------------------' .  config('app.TWILIO_AUTH_TOKEN'));


            // $otp = rand(100, 1000000);
            $otp = 123456;
            $client = new Client(config('app.TWILIO_SID'), config('app.TWILIO_AUTH_TOKEN'));

            $client->messages->create('+18777804236', [
                'from' => config('app.TWILIO_PHONE_NUMBER'),
                'body' => "Mã opt của bạn $otp là đừng gửi mã đang ký này cho ai"
            ]);
            // $client->messages->create($request->phone, [
            //     'from' => config('app.TWILIO_PHONE_NUMBER'),
            //     'body' => "Mã opt của bạn $otp là đừng gửi mã đang ký này cho ai"
            // ]);

            Log::info($client);

            // Đặt role mặc định là 'worker'
            $user = User::create(array_merge(
                $validator->validated(),
                [
                    'birth' => Carbon::now(),
                    'phone' => $request->phone ?? null,
                    'otp' => $otp,
                    'password' => bcrypt($request->password),
                    'role' => 'worker'
                ]
            ));


            return response()->json([
                'message' => 'User successfully registered',
                'user' => $user
            ], 201);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json($e, 500);
        }
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out'], 200);
    }

    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    public function userProfile()
    {
        return response()->json(auth()->user());
    }

    protected function respondWithToken($token)
    {
        $user = auth()->user(); // Lấy thông tin người dùng

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
            'role' => $user->role // Thêm role của người dùng vào phản hồi
        ]);
    }

    protected function otp(Request $request)
    {
        try {
            Log::info($request->all());

            $user = User::where('phone', $request->phone)->first();
            if(!empty($user) && $user->otp == $request->otp) {
                $user->update([
                    "active" => 1,
                ]);
            }else {
                return response()->json([
                    "error" => "CÓ lỗi "
                ], 500);
            }

            return response()->json([
                "success" => "Đã xác nhận thành công"
            ],200);
        } catch (Exception $e) {
            Log::info($e);

            return response()->json([
                "error" => "CÓ lỗi " . $e->getMessage()
            ], 500);
        }
    }
}
