package com.biotrust.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String actorUsername; // L'agent qui a fait l'action
    private String action; // ENROLLMENT, VERIFICATION, IDENTIFICATION
    private String beneficiaryId; // L'ID du bénéficiaire concerné
    private String status; // SUCCESS, FAILURE
    private String ipAddress;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
