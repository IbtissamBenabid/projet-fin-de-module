package com.biotrust.repository;

import com.biotrust.model.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    Optional<Beneficiary> findByDigitalId(String digitalId);
}
