package com.app.visite_technique.repository;

import com.app.visite_technique.entity.FicheTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FicheTechniqueRepository extends JpaRepository<FicheTechnique, Long> {
    List<FicheTechnique> findTop5ByOrderByDateDiagnosticDescIdDesc();

    @Query("SELECT f FROM FicheTechnique f WHERE " +
            "LOWER(f.immatriculation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.marque) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.modele) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.vehicule.client.nom) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.vehicule.client.prenom) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<FicheTechnique> search(@Param("query") String query, Pageable pageable);

    Page<FicheTechnique> findAll(Pageable pageable);
}
