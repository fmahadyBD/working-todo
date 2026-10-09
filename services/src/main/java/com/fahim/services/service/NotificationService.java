package com.fahim.service;

import com.fahim.entity.Notification;
import com.fahim.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;

    public Notification create(String title, String message, Long taskId) {
        return repo.save(Notification.builder()
            .title(title).message(message).taskId(taskId).build());
    }

    public List<Notification> getAll() { return repo.findAllByOrderByCreatedAtDesc(); }
    public List<Notification> getUnread() { return repo.findByReadFalseOrderByCreatedAtDesc(); }

    public Notification markRead(Long id) {
        Notification n = repo.findById(id).orElseThrow();
        n.setRead(true);
        return repo.save(n);
    }
}
