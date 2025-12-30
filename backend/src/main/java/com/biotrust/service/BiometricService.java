package com.biotrust.service;

import com.biotrust.dto.EnrollmentRequest;
import com.biotrust.model.AuditLog;
import com.biotrust.model.Beneficiary;
import com.biotrust.repository.AuditLogRepository;
import com.biotrust.repository.BeneficiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;
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
                try {
                        // 1. Collecte et Traitement via le service Python
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

                        // Conversion Base64 vers ressources Multipart pour l'envoi
                        body.add("face", new ByteArrayResource(
                                        Base64.getDecoder().decode(request.getFaceImageBase64())) {
                                @Override
                                public String getFilename() {
                                        return "face.jpg";
                                }
                        });
                        body.add("fingerprint", new ByteArrayResource(
                                        Base64.getDecoder().decode(request.getFingerprintImageBase64())) {
                                @Override
                                public String getFilename() {
                                        return "finger.jpg";
                                }
                        });

                        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

                        // Appel au service de traitement biométrique
                        ResponseEntity<Map> response = restTemplate.postForEntity(
                                        BIO_ENGINE_URL + "/collect/enroll",
                                        requestEntity,
                                        Map.class);

                        if (response.getStatusCode() == HttpStatus.OK) {
                                Map<String, Object> result = response.getBody();

                                // 2. Création et stockage de l'Identité Numérique (Données chiffrées
                                // uniquement)
                                Beneficiary beneficiary = Beneficiary.builder()
                                                .digitalId("REF-" + UUID.randomUUID().toString().substring(0, 8)
                                                                .toUpperCase())
                                                .firstName(request.getFirstName())
                                                .lastName(request.getLastName())
                                                .faceDescriptorEncrypted((String) result.get("face_descriptor"))
                                                .fingerprintDescriptorEncrypted(
                                                                (String) result.get("fingerprint_descriptor"))
                                                .build();

                                Beneficiary saved = beneficiaryRepository.save(beneficiary);

                                // 3. Traçabilité et Audit
                                auditLogRepository.save(AuditLog.builder()
                                                .actorUsername("system_agent")
                                                .action("ENROLLMENT")
                                                .beneficiaryId(saved.getDigitalId())
                                                .status("SUCCESS")
                                                .build());

                                return saved;
                        } else {
                                throw new RuntimeException("Erreur de traitement biométrique");
                        }
                } catch (Exception e) {
                        auditLogRepository.save(AuditLog.builder()
                                        .actorUsername("system_agent")
                                        .action("ENROLLMENT")
                                        .status("FAILURE")
                                        .build());
                        throw new RuntimeException("Échec de l'enrôlement : " + e.getMessage());
                }
        }

        public boolean verify(String digitalId, String faceImageBase64) {
                Beneficiary beneficiary = beneficiaryRepository.findByDigitalId(digitalId)
                                .orElseThrow(() -> new RuntimeException("Bénéficiaire non trouvé"));

                try {
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                        body.add("face", new ByteArrayResource(Base64.getDecoder().decode(faceImageBase64)) {
                                @Override
                                public String getFilename() {
                                        return "verify_face.jpg";
                                }
                        });
                        body.add("stored_descriptor", beneficiary.getFaceDescriptorEncrypted());

                        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

                        ResponseEntity<Map> response = restTemplate.postForEntity(
                                        BIO_ENGINE_URL + "/process/verify",
                                        requestEntity,
                                        Map.class);

                        boolean match = (boolean) response.getBody().get("is_match");

                        auditLogRepository.save(AuditLog.builder()
                                        .actorUsername("verifier_agent")
                                        .action("VERIFICATION")
                                        .beneficiaryId(digitalId)
                                        .status(match ? "SUCCESS" : "FAILURE")
                                        .build());

                        return match;
                } catch (Exception e) {
                        return false;
                }
        }
}
