package com.app.visite_technique.controller;

import com.app.visite_technique.entity.Vehicule;
import com.app.visite_technique.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/vehicules")
@CrossOrigin("*")
public class VehiculeController {

    @Autowired
    private VehiculeService service;

    @GetMapping
    public Page<Vehicule> getAllVehicules(
            @RequestParam(defaultValue = "") String part1,
            @RequestParam(defaultValue = "") String part2,
            @RequestParam(defaultValue = "") String part3,
            @PageableDefault(size = 10) Pageable pageable) {
        if (!part1.isEmpty() || !part2.isEmpty() || !part3.isEmpty()) {
            return service.search(part1, part2, part3, pageable);
        }
        return service.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicule> getVehiculeById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vehicule createVehicule(@RequestBody Vehicule vehicule) {
        return service.save(vehicule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicule> updateVehicule(@PathVariable Long id, @RequestBody Vehicule vehicule) {
        return service.findById(id)
                .map(existing -> {
                    vehicule.setId(id);
                    return ResponseEntity.ok(service.save(vehicule));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        return service.findById(id)
                .map(vehicule -> {
                    service.delete(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
