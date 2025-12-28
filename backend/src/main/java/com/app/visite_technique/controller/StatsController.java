package com.app.visite_technique.controller;

import com.app.visite_technique.dto.StatsDTO;
import com.app.visite_technique.repository.ClientRepository;
import com.app.visite_technique.repository.VehiculeRepository;
import com.app.visite_technique.repository.FicheTechniqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin("*")
public class StatsController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private FicheTechniqueRepository ficheRepository;

    @GetMapping
    public StatsDTO getStats() {
        return new StatsDTO(
                clientRepository.count(),
                vehiculeRepository.count(),
                ficheRepository.count());
    }
}
