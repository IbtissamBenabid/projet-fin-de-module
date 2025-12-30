package com.biotrust.controller;

import com.biotrust.dto.EnrollmentRequest;
import com.biotrust.model.Beneficiary;
import com.biotrust.service.BiometricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/biometrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiometricController {

    private final BiometricService biometricService;

    @PostMapping("/enroll")
    public ResponseEntity<Beneficiary> enroll(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(biometricService.enroll(request));
    }

    @GetMapping("/verify/{digitalId}")
    public ResponseEntity<Boolean> verify(@PathVariable String digitalId, @RequestParam String faceBase64) {
        return ResponseEntity.ok(biometricService.verify(digitalId, faceBase64));
    }
}
