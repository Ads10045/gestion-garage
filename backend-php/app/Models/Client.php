<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Client",
 *     required={"nom", "prenom", "telephone"},
 *     @OA\Property(property="id", type="integer", readOnly=true),
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="prenom", type="string"),
 *     @OA\Property(property="cin", type="string"),
 *     @OA\Property(property="email", type="string"),
 *     @OA\Property(property="telephone", type="string"),
 *     @OA\Property(property="adresse", type="string")
 * )
 */
class Client extends Model
{
    protected $table = 'client';
    public $timestamps = false;

    protected $fillable = [
        'nom', 'prenom', 'cin', 'email', 'telephone', 'adresse'
    ];

    public function vehicules()
    {
        return $this->hasMany(Vehicule::class);
    }
}
