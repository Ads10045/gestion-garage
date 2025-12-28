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
        Schema::create('fiche_techniques', function (Blueprint $table) {
            $table->id();
            
            // Dates
            $table->date('date_diagnostic');
            $table->date('date_reparation')->nullable();
            
            // Meters
            $table->integer('kilometrage');
            
            // Diagnostic
            $table->json('pannes')->nullable(); // Store as JSON array
            $table->text('description_diagnostic')->nullable();
            
            // Repair
            $table->json('pieces_changees')->nullable(); // Store as JSON array
            $table->decimal('cout_pieces', 10, 2)->default(0);
            $table->decimal('cout_main_oeuvre', 10, 2)->default(0);
            $table->decimal('duree_reparation_heures', 5, 2)->default(0);
            $table->boolean('reparable')->default(true);
            
            // Status & Gravity (Enums stored as strings)
            $table->string('statut')->default('EN_COURS'); // EN_COURS, REPARE, NON_REPARABLE, A_REVOIR
            $table->string('gravite')->default('MINEURE'); // MINEURE, MAJEURE, CRITIQUE
            
            // Component States (Enums stored as strings)
            $table->string('etat_moteur')->default('BON'); // BON, MOYEN, MAUVAIS
            $table->string('etat_freins')->default('BON');
            $table->string('etat_suspension')->default('BON');
            $table->string('etat_electrique')->default('BON');
            $table->string('etat_carrosserie')->default('BON');
            $table->string('etat_general')->default('BON');
            
            // Observations
            $table->text('observation_mecanicien')->nullable();

            // Relations
            $table->foreignId('vehicule_id')->constrained('vehicules')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiche_techniques');
    }
};
