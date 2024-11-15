<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return view('auth.login', ['isLogin' => true]);
})->name('login');

Route::get('/register', function () {
    return view('auth.login', ['isLogin' => false]);
})->name('register');

// Các route dành cho admin và manager

Route::get('/admin', function () {
    return view('admin.index');
})->name('admin.index');

Route::get('material', function () {
    return view('admin.material.list');
})->name('admin.material.list');

Route::get('supplier', function () {
    return view('admin.supplier.list');
})->name('admin.supplier.list');

Route::get('user', function () {
    return view('admin.user.list');
})->name('admin.user.list');

Route::get('purchase', function () {
    return view('admin.purchase.list');
})->name('admin.purchase.list');

Route::get('project', function () {
    return view('admin.project.list');
})->name('admin.project.list');
// Route dành riêng cho worker

Route::get('/worker', function () {
    return view('worker.index');
})->name('worker.index');
