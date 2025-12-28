<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('immatriculation_part1');
            $table->string('immatriculation_part2');
            $table->string('immatriculation_part3');
            $table->string('marque');
            $table->string('modele');
            $table->string('type_vehicule')->nullable();
            $table->string('carburant')->nullable();
            $table->string('puissance_fiscale')->nullable();
            $table->string('annee_mise_circulation')->nullable();
            $table->string('numero_chassis')->nullable();
            $table->integer('kilometrage_compteur')->default(0);
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
