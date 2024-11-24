<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\TaskController;
// Route đăng nhập và đăng ký không yêu cầu xác thực
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/user-profile', [AuthController::class, 'userProfile']);

Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/update/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects/store', [ProjectController::class, 'store']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::put('/projects/update/{id}', [ProjectController::class, 'update']);
Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

Route::get('/materials', [MaterialController::class, 'index']);
Route::post('/materials/store', [MaterialController::class, 'store']);
Route::get('/materials/{id}', [MaterialController::class, 'show']);
Route::put('/materials/update/{id}', [MaterialController::class, 'update']);
Route::delete('/materials/{id}', [MaterialController::class, 'destroy']);

Route::get('/suppliers', [SupplierController::class, 'index']);
Route::post('/suppliers/store', [SupplierController::class, 'store']);
Route::get('/suppliers/{id}', [SupplierController::class, 'show']);
Route::put('/suppliers/update/{id}', [SupplierController::class, 'update']);
Route::delete('/suppliers/{id}', [SupplierController::class, 'destroy']);

Route::get('purchases', [PurchaseController::class, 'index']);
Route::post('/purchases/store', [PurchaseController::class, 'store']);
Route::get('/purchases/{id}', [PurchaseController::class, 'show']);
Route::put('purchases/update/{id}', [PurchaseController::class, 'update']);
Route::delete('/purchases/{id}', [PurchaseController::class, 'destroy']);

Route::get('tasks', [TaskController::class, 'index']);
Route::get('tasks/projects/{id}', [TaskController::class, 'index1']);
// Route::get('tasks/projects/{id}', [TaskController::class, 'index1']);
Route::post('/tasks/store', [TaskController::class, 'store']);
Route::get('/tasks/{id}', [TaskController::class, 'show']);
Route::put('tasks/update/{id}', [TaskController::class, 'update']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

Route::get('/counts', [DashboardController::class, 'getCounts']);
