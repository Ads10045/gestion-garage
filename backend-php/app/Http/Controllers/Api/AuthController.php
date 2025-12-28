<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/auth/login",
     *     summary="User login",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Login successful")
     * )
     */
    public function login(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        if ($username === 'admin' && $password === 'admin') {
            return response()->json([
                'token' => 'fake-jwt-token-admin',
                'role' => 'ADMIN'
            ]);
        }

        if ($username === 'user' && $password === 'user') {
            return response()->json([
                'token' => 'fake-jwt-token-user',
                'role' => 'USER'
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
