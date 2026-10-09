package com.fahim.repository;

import com.fahim.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    List<Notification> findAllByOrderByCreatedAtDesc();
}
