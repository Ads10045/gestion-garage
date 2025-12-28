package com.app.visite_technique.service;

import com.app.visite_technique.entity.Vehicule;
import com.app.visite_technique.repository.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
public class VehiculeService {
    @Autowired
    private VehiculeRepository repository;

    public Page<Vehicule> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<Vehicule> findById(Long id) {
        return repository.findById(id);
    }

    public Vehicule save(Vehicule vehicule) {
        return repository.save(vehicule);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Page<Vehicule> search(String part1, String part2, String part3, Pageable pageable) {
        return repository
                .findByImmatriculationPart1ContainingIgnoreCaseAndImmatriculationPart2ContainingIgnoreCaseAndImmatriculationPart3ContainingIgnoreCase(
                        part1, part2, part3, pageable);
    }
}
