package com.campushub.service;

import com.campushub.dto.RegistrationDto;

import java.util.List;

/**
 * Service contract for Registration management.
 */
public interface RegistrationService {

    List<RegistrationDto> getAllRegistrations();

    RegistrationDto getRegistrationById(Long id);

    RegistrationDto createRegistration(RegistrationDto registrationDto);

    RegistrationDto updateRegistration(Long id, RegistrationDto registrationDto);

    void deleteRegistration(Long id);
}
