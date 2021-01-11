<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/**
 * The line below redirects all first level url paths in the browser to index view,
 * this implies that paths like localhost:8080/test or localhost:8080/error will
 * redirect us to the index view while higher orders like localhost:8080/test/error
 * or localhost:8080/test/error/sad will return Laravel’s default 404 page
 */
Route::view('/{path?}', 'welcome');
