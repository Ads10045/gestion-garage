<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\VehiculeController;
use App\Http\Controllers\Api\FicheTechniqueController;
use App\Http\Controllers\Api\StatsController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::apiResource('clients', ClientController::class);
Route::apiResource('vehicules', VehiculeController::class);

Route::get('/fiches/recent', [FicheTechniqueController::class, 'recent']);
Route::apiResource('fiches', FicheTechniqueController::class);

Route::get('/stats', [StatsController::class, 'index']);
