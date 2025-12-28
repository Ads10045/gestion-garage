<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Vehicule",
 *     required={"immatriculation_part1", "immatriculation_part2", "immatriculation_part3", "marque", "modele", "client_id"},
 *     @OA\Property(property="id", type="integer", readOnly=true),
 *     @OA\Property(property="immatriculation_part1", type="string"),
 *     @OA\Property(property="immatriculation_part2", type="string"),
 *     @OA\Property(property="immatriculation_part3", type="string"),
 *     @OA\Property(property="marque", type="string"),
 *     @OA\Property(property="modele", type="string"),
 *     @OA\Property(property="type_vehicule", type="string"),
 *     @OA\Property(property="carburant", type="string"),
 *     @OA\Property(property="puissance_fiscale", type="string"),
 *     @OA\Property(property="annee_mise_circulation", type="string"),
 *     @OA\Property(property="numero_chassis", type="string"),
 *     @OA\Property(property="kilometrage_compteur", type="integer"),
 *     @OA\Property(property="client_id", type="integer")
 * )
 */
class Vehicule extends Model
{
    protected $table = 'vehicule';
    public $timestamps = false;

    protected $fillable = [
        'immatriculation_part1', 'immatriculation_part2', 'immatriculation_part3',
        'marque', 'modele', 'type_vehicule', 'carburant', 'puissance_fiscale',
        'annee_mise_circulation', 'numero_chassis', 'kilometrage_compteur', 'client_id'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function fiches()
    {
        return $this->hasMany(FicheTechnique::class, 'vehicule_id');
    }
}
