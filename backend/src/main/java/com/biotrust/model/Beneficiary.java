package com.biotrust.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String digitalId; // Formatted REF-XXXXXX

    private String firstName;
    private String lastName;
    
    @Column(columnDefinition = "TEXT")
    private String faceDescriptorEncrypted; // AES-256 encrypted vector
    
    @Column(columnDefinition = "TEXT")
    private String fingerprintDescriptorEncrypted; // AES-256 encrypted vector

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private boolean isRevoked;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isRevoked = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
