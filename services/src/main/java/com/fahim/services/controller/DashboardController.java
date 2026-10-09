package com.fahim.controller;

import com.fahim.dto.DashboardResponse;
import com.fahim.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardResponse getStats() { return service.getStats(); }
}
