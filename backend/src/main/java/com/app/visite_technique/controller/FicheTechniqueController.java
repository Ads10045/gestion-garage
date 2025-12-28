package com.app.visite_technique.controller;

import com.app.visite_technique.entity.FicheTechnique;
import com.app.visite_technique.service.FicheTechniqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import java.util.List;

@RestController
@RequestMapping("/api/fiches")
@CrossOrigin("*")
public class FicheTechniqueController {

    @Autowired
    private FicheTechniqueService service;

    @GetMapping
    public Page<FicheTechnique> getAllFiches(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 10) Pageable pageable) {
        if (query != null && !query.isEmpty()) {
            return service.search(query, pageable);
        }
        return service.findAll(pageable);
    }

    @GetMapping("/recent")
    public List<FicheTechnique> getRecentFiches() {
        return service.findRecentFiches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FicheTechnique> getFicheById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FicheTechnique createFiche(@RequestBody FicheTechnique fiche) {
        return service.save(fiche);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FicheTechnique> updateFiche(@PathVariable Long id, @RequestBody FicheTechnique fiche) {
        return service.findById(id)
                .map(existing -> {
                    fiche.setId(id);
                    return ResponseEntity.ok(service.save(fiche));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFiche(@PathVariable Long id) {
        return service.findById(id)
                .map(fiche -> {
                    service.delete(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
