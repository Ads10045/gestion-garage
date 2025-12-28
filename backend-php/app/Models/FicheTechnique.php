<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="FicheTechnique",
 *     required={"date_diagnostic", "kilometrage", "vehicule_id"},
 *     @OA\Property(property="id", type="integer", readOnly=true),
 *     @OA\Property(property="date_diagnostic", type="string", format="date"),
 *     @OA\Property(property="date_reparation", type="string", format="date", nullable=true),
 *     @OA\Property(property="kilometrage", type="integer"),
 *     @OA\Property(property="pannes", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="description_diagnostic", type="string"),
 *     @OA\Property(property="pieces_changees", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="cout_pieces", type="number", format="float"),
 *     @OA\Property(property="cout_main_oeuvre", type="number", format="float"),
 *     @OA\Property(property="duree_reparation_heures", type="number", format="float"),
 *     @OA\Property(property="reparable", type="boolean"),
 *     @OA\Property(property="statut", type="string", enum={"EN_COURS", "REPARE", "NON_REPARABLE", "A_REVOIR"}),
 *     @OA\Property(property="gravite", type="string", enum={"MINEURE", "MAJEURE", "CRITIQUE"}),
 *     @OA\Property(property="etat_moteur", type="string", enum={"BON", "MOYEN", "MAUVAIS"}),
 *     @OA\Property(property="etat_freins", type="string"),
 *     @OA\Property(property="etat_suspension", type="string"),
 *     @OA\Property(property="etat_electrique", type="string"),
 *     @OA\Property(property="etat_carrosserie", type="string"),
 *     @OA\Property(property="etat_general", type="string"),
 *     @OA\Property(property="observation_mecanicien", type="string"),
 *     @OA\Property(property="vehicule_id", type="integer")
 * )
 */
class FicheTechnique extends Model
{
    protected $table = 'fiche_technique';
    public $timestamps = false;

    protected $fillable = [
        'immatriculation',
        'marque',
        'modele',
        'annee',
        'date_diagnostic',
        'date_reparation',
        'kilometrage',
        'description_diagnostic',
        'cout_pieces',
        'cout_main_oeuvre',
        'duree_reparation_heures',
        'reparable',
        'statut',
        'gravite',
        'etat_moteur',
        'etat_freins',
        'etat_suspension',
        'etat_electrique',
        'etat_carrosserie',
        'etat_general',
        'observation_mecanicien',
        'vehicule_id'
    ];

    protected $casts = [
        'reparable' => 'boolean',
        'cout_pieces' => 'float',
        'cout_main_oeuvre' => 'float',
        'duree_reparation_heures' => 'float',
    ];

    protected $appends = ['pannes', 'pieces_changees'];

    public function getPannesAttribute()
    {
        return \Illuminate\Support\Facades\DB::table('fiche_pannes')
            ->where('fiche_id', $this->id)
            ->pluck('panne')
            ->toArray();
    }

    public function getPiecesChangeesAttribute()
    {
        return \Illuminate\Support\Facades\DB::table('fiche_pieces_changees')
            ->where('fiche_id', $this->id)
            ->pluck('piece')
            ->toArray();
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}
