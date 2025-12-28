<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicule;

class VehiculeController extends Controller
{
    /**
     * @OA\Get(
     *     path="/vehicules",
     *     summary="Get all vehicles with pagination and search",
     *     tags={"Vehicles"},
     *     @OA\Parameter(name="query", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="size", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="List of vehicles")
     * )
     */
    public function index(Request $request)
    {
        $query = $request->input('query');
        $size = $request->input('size', 10);

        $vehicules = Vehicule::with('client')->when($query, function ($q) use ($query) {
            $q->where('immatriculation_part1', 'ilike', "%{$query}%")
              ->orWhere('immatriculation_part2', 'ilike', "%{$query}%")
              ->orWhere('immatriculation_part3', 'ilike', "%{$query}%")
              ->orWhere('marque', 'ilike', "%{$query}%")
              ->orWhere('modele', 'ilike', "%{$query}%");
        })->paginate($size);

        return response()->json([
            'content' => $vehicules->items(),
            'totalElements' => $vehicules->total(),
            'totalPages' => $vehicules->lastPage(),
            'size' => $vehicules->perPage(),
            'number' => $vehicules->currentPage() - 1,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/vehicules",
     *     summary="Create a new vehicle",
     *     tags={"Vehicles"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Vehicule")),
     *     @OA\Response(response=201, description="Vehicle created")
     * )
     */
    public function store(Request $request)
    {
        $vehicule = Vehicule::create($request->all());
        return response()->json($vehicule, 201);
    }

    /**
     * @OA\Get(
     *     path="/vehicules/{id}",
     *     summary="Get vehicle details",
     *     tags={"Vehicles"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\Response(response=200, description="Vehicle details")
     * )
     */
    public function show($id)
    {
        return Vehicule::with(['client', 'visite_techniques'])->findOrFail($id);
    }

    /**
     * @OA\Put(
     *     path="/vehicules/{id}",
     *     summary="Update a vehicle",
     *     tags={"Vehicles"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Vehicule")),
     *     @OA\Response(response=200, description="Vehicle updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $vehicule = Vehicule::findOrFail($id);
        $vehicule->update($request->all());
        return response()->json($vehicule);
    }

    /**
     * @OA\Delete(
     *     path="/vehicules/{id}",
     *     summary="Delete a vehicle",
     *     tags={"Vehicles"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\Response(response=204, description="No content")
     * )
     */
    public function destroy($id)
    {
        Vehicule::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
