<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FicheTechnique;

class FicheTechniqueController extends Controller
{
    /**
     * @OA\Get(
     *     path="/fiches",
     *     summary="Get all fiches with pagination and search",
     *     tags={"Fiches"},
     *     @OA\Parameter(name="query", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="size", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="List of fiches")
     * )
     */
    public function index(Request $request)
    {
        $query = $request->input('query');
        $size = $request->input('size', 10);

        $fiches = FicheTechnique::with(['vehicule.client'])->when($query, function ($q) use ($query) {
            $q->where('vehicule_id', 'like', "%{$query}%") // Simplified basic search if fields not joined
              ->orWhereHas('vehicule', function ($vq) use ($query) {
                  $vq->where('immatriculation_part1', 'ilike', "%{$query}%")
                     ->orWhere('immatriculation_part2', 'ilike', "%{$query}%")
                     ->orWhere('immatriculation_part3', 'ilike', "%{$query}%")
                     ->orWhereHas('client', function ($cq) use ($query) {
                         $cq->where('nom', 'ilike', "%{$query}%")
                            ->orWhere('prenom', 'ilike', "%{$query}%");
                     });
              });
        })->paginate($size);

        return response()->json([
            'content' => $fiches->items(),
            'totalElements' => $fiches->total(),
            'totalPages' => $fiches->lastPage(),
            'size' => $fiches->perPage(),
            'number' => $fiches->currentPage() - 1,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/fiches/recent",
     *     summary="Get recent fiches",
     *     tags={"Fiches"},
     *     @OA\Response(response=200, description="Recent fiches")
     * )
     */
    public function recent()
    {
        return FicheTechnique::with(['vehicule.client'])
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();
    }

    /**
     * @OA\Post(
     *     path="/fiches",
     *     summary="Create a new fiche",
     *     tags={"Fiches"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/FicheTechnique")),
     *     @OA\Response(response=201, description="Fiche created")
     * )
     */
    public function store(Request $request)
    {
        try {
            \Illuminate\Support\Facades\DB::beginTransaction();
            
            // Create Fiche (snapshot columns are fillable now)
            $fiche = FicheTechnique::create($request->except(['pannes', 'pieces_changees', 'piecesChangees']));

            // Handle Pannes (External Table fiche_pannes)
            if ($request->has('pannes') && is_array($request->input('pannes'))) {
                $pannesData = [];
                foreach ($request->input('pannes') as $p) {
                    if (!empty($p)) {
                        $pannesData[] = ['fiche_id' => $fiche->id, 'panne' => $p];
                    }
                }
                if (!empty($pannesData)) {
                    \Illuminate\Support\Facades\DB::table('fiche_pannes')->insert($pannesData);
                }
            }

            // Handle Pieces (External Table fiche_pieces_changees)
            // Frontend might send 'piecesChangees' (camelCase) or 'pieces_changees' (snake_case)
            $piecesInput = $request->input('pieces_changees') ?? $request->input('piecesChangees');
            if (!empty($piecesInput) && is_array($piecesInput)) {
                $piecesData = [];
                foreach ($piecesInput as $p) {
                    if (!empty($p)) {
                        $piecesData[] = ['fiche_id' => $fiche->id, 'piece' => $p];
                    }
                }
                if (!empty($piecesData)) {
                    \Illuminate\Support\Facades\DB::table('fiche_pieces_changees')->insert($piecesData);
                }
            }

            \Illuminate\Support\Facades\DB::commit();
            return response()->json($fiche->fresh(), 201);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['error' => 'Erreur lors de la création: ' . $e->getMessage()], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $fiche = FicheTechnique::findOrFail($id);
            $fiche->update($request->except(['pannes', 'pieces_changees', 'piecesChangees']));

            // Update Pannes: Delete old, Insert new
            // Assuming full replacement logic like Java @ElementCollection usually does
            \Illuminate\Support\Facades\DB::table('fiche_pannes')->where('fiche_id', $fiche->id)->delete();
            
            if ($request->has('pannes') && is_array($request->input('pannes'))) {
                $pannesData = [];
                foreach ($request->input('pannes') as $p) {
                     if (!empty($p)) {
                        $pannesData[] = ['fiche_id' => $fiche->id, 'panne' => $p];
                     }
                }
                if (!empty($pannesData)) {
                    \Illuminate\Support\Facades\DB::table('fiche_pannes')->insert($pannesData);
                }
            }

            // Update Pieces
            \Illuminate\Support\Facades\DB::table('fiche_pieces_changees')->where('fiche_id', $fiche->id)->delete();
            $piecesInput = $request->input('pieces_changees') ?? $request->input('piecesChangees');
            if (!empty($piecesInput) && is_array($piecesInput)) {
                $piecesData = [];
                foreach ($piecesInput as $p) {
                     if (!empty($p)) {
                        $piecesData[] = ['fiche_id' => $fiche->id, 'piece' => $p];
                     }
                }
                if (!empty($piecesData)) {
                    \Illuminate\Support\Facades\DB::table('fiche_pieces_changees')->insert($piecesData);
                }
            }

            \Illuminate\Support\Facades\DB::commit();
            return response()->json($fiche->fresh());

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['error' => 'Erreur lors de la modification: ' . $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/fiches/{id}",
     *     summary="Delete a fiche",
     *     tags={"Fiches"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="long")),
     *     @OA\Response(response=204, description="No content")
     * )
     */
    public function destroy($id)
    {
        FicheTechnique::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
