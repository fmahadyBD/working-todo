package com.fahim.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fahim.services.entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    List<Notification> findAllByOrderByCreatedAtDesc();
}
