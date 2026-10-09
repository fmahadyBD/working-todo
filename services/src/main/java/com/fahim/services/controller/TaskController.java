package com.fahim.controller;

import com.fahim.dto.TaskRequest;
import com.fahim.entity.Task;
import com.fahim.enums.TaskSection;
import com.fahim.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService service;

    @GetMapping
    public List<Task> getAll() { return service.getAll(); }

    @GetMapping("/section/{section}")
    public List<Task> getBySection(@PathVariable TaskSection section) {
        return service.getBySection(section);
    }

    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public Task create(@Valid @RequestBody TaskRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody TaskRequest req) {
        return service.update(id, req);
    }

    @PatchMapping("/{id}/complete")
    public Task complete(@PathVariable Long id) { return service.complete(id); }

    @PatchMapping("/{id}/move/{section}")
    public Task move(@PathVariable Long id, @PathVariable TaskSection section) {
        return service.moveSection(id, section);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
