package com.fahim.controller;

import com.fahim.entity.Notification;
import com.fahim.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public List<Notification> getAll() { return service.getAll(); }

    @GetMapping("/unread")
    public List<Notification> getUnread() { return service.getUnread(); }

    @PatchMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id) { return service.markRead(id); }
}
