<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\LogoutController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectDetailController;
use App\Http\Controllers\Api\ProjectNameController;
use App\Http\Controllers\Api\ProjectStatusController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', LoginController::class);

//group route with middleware "auth:api"
Route::group(['middleware' => 'auth:api'], function () {

    //route user logged in
    Route::get('user', function (Request $request) {
        return $request->user();
    })->name('user');

    Route::post('logout', LogoutController::class);

     //category resource
     Route::apiResource('projectName', ProjectNameController::class, ['except' => ['create', 'edit']]);
    //  Route::get('projectNameByName/{name}', [ProjectNameController::class, 'showName']);
     Route::apiResource('project', ProjectController::class, ['except' => ['create', 'edit']]);

     Route::apiResource('projectStatus', ProjectStatusController::class, ['except' => ['create', 'edit']]);

     Route::apiResource('projectDetail', ProjectDetailController::class, ['except' => ['create', 'edit']]);

     Route::get('searchBy/{number?},{startDate},{endDate}', [ProjectController::class, 'searchBy']);

});
