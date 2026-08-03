package com.campushub.service.impl;

import com.campushub.dto.RegistrationDto;
import com.campushub.entity.Event;
import com.campushub.entity.Registration;
import com.campushub.entity.User;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.EventRepository;
import com.campushub.repository.RegistrationRepository;
import com.campushub.repository.UserRepository;
import com.campushub.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of RegistrationService with full CRUD and entity/DTO mapping.
 */
@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<RegistrationDto> getAllRegistrations() {
        return registrationRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public RegistrationDto getRegistrationById(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
        return mapToDto(registration);
    }

    @Override
    public RegistrationDto createRegistration(RegistrationDto registrationDto) {
        Event event = eventRepository.findById(registrationDto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + registrationDto.getEventId()));

        User user = userRepository.findById(registrationDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + registrationDto.getUserId()));

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setStatus(Registration.Status.PENDING);

        Registration saved = registrationRepository.save(registration);
        return mapToDto(saved);
    }

    @Override
    public RegistrationDto updateRegistration(Long id, RegistrationDto registrationDto) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));

        if (registrationDto.getStatus() != null) {
            registration.setStatus(
                    Registration.Status.valueOf(registrationDto.getStatus())
            );
        }

        Registration updated = registrationRepository.save(registration);
        return mapToDto(updated);
    }

    @Override
    public void deleteRegistration(Long id) {
        if (!registrationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Registration not found with id: " + id);
        }
        registrationRepository.deleteById(id);
    }

    private RegistrationDto mapToDto(Registration registration) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(registration.getId());

        if (registration.getEvent() != null) {
            dto.setEventId(registration.getEvent().getId());
            dto.setEventTitle(registration.getEvent().getTitle());
        }

        if (registration.getUser() != null) {
            dto.setUserId(registration.getUser().getId());
        }

        if (registration.getStatus() != null) {
            dto.setStatus(registration.getStatus().name());
        }

        dto.setRegisteredAt(registration.getRegisteredAt());
        return dto;
    }
}
