<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Vehicule;
use App\Models\FicheTechnique;

class StatsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/stats",
     *     summary="Get dashboard statistics",
     *     tags={"Stats"},
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques du tableau de bord",
     *         @OA\JsonContent(
     *             @OA\Property(property="totalClients", type="integer"),
     *             @OA\Property(property="totalVehicules", type="integer"),
     *             @OA\Property(property="totalFiches", type="integer")
     *         )
     *     )
     * )
     */
    public function index()
    {
        return response()->json([
            'totalClients' => Client::count(),
            'totalVehicules' => Vehicule::count(),
            'totalFiches' => FicheTechnique::count(),
        ]);
    }
}
