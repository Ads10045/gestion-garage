<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    /**
     * @OA\Get(
     *     path="/clients",
     *     summary="Get all clients with pagination and search",
     *     tags={"Clients"},
     *     @OA\Parameter(name="query", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="size", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="List of clients")
     * )
     */
    public function index(Request $request)
    {
        $query = $request->input('query');
        $size = $request->input('size', 10);

        $clients = Client::when($query, function ($q) use ($query) {
            $q->where('nom', 'ilike', "%{$query}%")
              ->orWhere('prenom', 'ilike', "%{$query}%")
              ->orWhere('cin', 'ilike', "%{$query}%");
        })->paginate($size);

        return response()->json([
            'content' => $clients->items(),
            'totalElements' => $clients->total(),
            'totalPages' => $clients->lastPage(),
            'size' => $clients->perPage(),
            'number' => $clients->currentPage() - 1,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/clients",
     *     summary="Create a new client",
     *     tags={"Clients"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Client")),
     *     @OA\Response(response=201, description="Client created")
     * )
     */
    public function store(Request $request)
    {
        $client = Client::create($request->all());
        return response()->json($client, 201);
    }

    /**
     * @OA\Get(
     *     path="/clients/{id}",
     *     summary="Get client details",
     *     tags={"Clients"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\Response(response=200, description="Client details")
     * )
     */
    public function show($id)
    {
        return Client::with('vehicules')->findOrFail($id);
    }

    /**
     * @OA\Put(
     *     path="/clients/{id}",
     *     summary="Update a client",
     *     tags={"Clients"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Client")),
     *     @OA\Response(response=200, description="Client updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        $client->update($request->all());
        return response()->json($client);
    }

    /**
     * @OA\Delete(
     *     path="/clients/{id}",
     *     summary="Delete a client",
     *     tags={"Clients"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\Response(response=204, description="No content")
     * )
     */
    public function destroy($id)
    {
        Client::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
