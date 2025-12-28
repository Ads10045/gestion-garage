package com.app.visite_technique.repository;

import com.app.visite_technique.entity.Vehicule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    Page<Vehicule> findByImmatriculationPart1ContainingIgnoreCaseAndImmatriculationPart2ContainingIgnoreCaseAndImmatriculationPart3ContainingIgnoreCase(
            String part1, String part2, String part3, Pageable pageable);

    // Quick search by part
    Page<Vehicule> findByImmatriculationPart1ContainingIgnoreCase(String part1, Pageable pageable);
}
