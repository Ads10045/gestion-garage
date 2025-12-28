package com.app.visite_technique.service;

import com.app.visite_technique.entity.FicheTechnique;
import com.app.visite_technique.repository.FicheTechniqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class FicheTechniqueService {
    @Autowired
    private FicheTechniqueRepository repository;

    public Page<FicheTechnique> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<FicheTechnique> findAll() {
        return repository.findAll();
    }

    public Optional<FicheTechnique> findById(Long id) {
        return repository.findById(id);
    }

    public FicheTechnique save(FicheTechnique fiche) {
        return repository.save(fiche);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<FicheTechnique> findRecentFiches() {
        return repository.findTop5ByOrderByDateDiagnosticDescIdDesc();
    }

    public Page<FicheTechnique> search(String query, Pageable pageable) {
        return repository.search(query, pageable);
    }
}
