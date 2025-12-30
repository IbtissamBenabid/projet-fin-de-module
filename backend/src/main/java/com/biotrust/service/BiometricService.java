package com.biotrust.service;

import com.biotrust.dto.EnrollmentRequest;
import com.biotrust.model.AuditLog;
import com.biotrust.model.Beneficiary;
import com.biotrust.repository.AuditLogRepository;
import com.biotrust.repository.BeneficiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BiometricService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AuditLogRepository auditLogRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final String BIO_ENGINE_URL = "http://localhost:8000";

    public Beneficiary enroll(EnrollmentRequest request) {
        // 1. Appeler le service Python pour extraire les descripteurs
        // Simulé ici pour la démo, en réel on enverrait les images au service Python

        String faceDescriptor = "ENCRYPTED_FACE_VECTOR_" + UUID.randomUUID().toString();
        String fingerDescriptor = "ENCRYPTED_FINGER_VECTOR_" + UUID.randomUUID().toString();

        // 2. Créer le bénéficiaire
        Beneficiary beneficiary = Beneficiary.builder()
                .digitalId("REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .faceDescriptorEncrypted(faceDescriptor)
                .fingerprintDescriptorEncrypted(fingerDescriptor)
                .build();

        Beneficiary saved = beneficiaryRepository.save(beneficiary);

        // 3. Logger l'audit
        auditLogRepository.save(AuditLog.builder()
                .actorUsername("agent_007")
                .action("ENROLLMENT")
                .beneficiaryId(saved.getDigitalId())
                .status("SUCCESS")
                .build());

        return saved;
    }

    public boolean verify(String digitalId, String faceImageBase64) {
        Beneficiary beneficiary = beneficiaryRepository.findByDigitalId(digitalId)
                .orElseThrow(() -> new RuntimeException("Bénéficiaire non trouvé"));

        // Simuler la comparaison via le service Python
        // Double check avec le score retourné par Python
        boolean match = true; // Simulé

        auditLogRepository.save(AuditLog.builder()
                .actorUsername("agent_verifier")
                .action("VERIFICATION")
                .beneficiaryId(digitalId)
                .status(match ? "SUCCESS" : "FAILURE")
                .build());

        return match;
    }
}
