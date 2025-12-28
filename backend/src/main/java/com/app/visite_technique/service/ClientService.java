package com.app.visite_technique.service;

import com.app.visite_technique.entity.Client;
import com.app.visite_technique.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository repository;

    public Page<Client> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Optional<Client> findById(Long id) {
        return repository.findById(id);
    }

    public Client save(Client client) {
        return repository.save(client);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Page<Client> search(String query, Pageable pageable) {
        return repository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrCinContainingIgnoreCase(query,
                query, query, pageable);
    }
}
