package com.fahim.services.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.fahim.services.dto.DashboardResponse;
import com.fahim.services.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardResponse getStats() { return service.getStats(); }
}
