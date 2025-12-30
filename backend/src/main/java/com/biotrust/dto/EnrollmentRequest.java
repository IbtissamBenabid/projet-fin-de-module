package com.biotrust.dto;

import lombok.Data;

@Data
public class EnrollmentRequest {
    private String firstName;
    private String lastName;
    private String faceImageBase64;
    private String fingerprintImageBase64;
}
