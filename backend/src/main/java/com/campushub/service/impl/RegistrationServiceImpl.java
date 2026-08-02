package com.campushub.service.impl;

import com.campushub.dto.RegistrationDto;
import com.campushub.repository.RegistrationRepository;
import com.campushub.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.campushub.entity.Registration;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Placeholder implementation of RegistrationService.
 * TODO (Member 5): implement mapping between Registration entity and RegistrationDto,
 * and add real business logic for each method below.
 */
@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Override
    public List<RegistrationDto> getAllRegistrations() {

        return registrationRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();

    }

    @Override
    public RegistrationDto getRegistrationById(Long id) {


        Registration registration =
                registrationRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Registration not found"
                                )
                        );


        return mapToDto(registration);

    }
    @Override
    public RegistrationDto createRegistration(
            RegistrationDto registrationDto
    ) {


        Registration registration =
                new Registration();


        registration.setRegisteredAt(
                LocalDateTime.now()
        );


        registration.setStatus(
                Registration.Status.PENDING
        );


        Registration saved =
                registrationRepository.save(registration);



        return mapToDto(saved);

    }
    @Override
    public RegistrationDto updateRegistration(
            Long id,
            RegistrationDto registrationDto
    ) {


        Registration registration =
                registrationRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Registration not found"
                                )
                        );



        if(registrationDto.getStatus()!=null){

            registration.setStatus(
                    Registration.Status.valueOf(
                            registrationDto.getStatus()
                    )
            );

        }



        Registration updated =
                registrationRepository.save(registration);



        return mapToDto(updated);

    }
    @Override
    public void deleteRegistration(Long id) {


        registrationRepository.deleteById(id);

    }
    private RegistrationDto mapToDto(
            Registration registration
    ){

        RegistrationDto dto =
                new RegistrationDto();


        dto.setId(
                registration.getId()
        );


        if(registration.getEvent()!=null){

            dto.setEventTitle(
                    registration.getEvent().getTitle()
            );

        }


        if(registration.getStatus()!=null){

            dto.setStatus(
                    registration.getStatus().name()
            );

        }


        dto.setRegisteredAt(
                registration.getRegisteredAt()
        );


        return dto;

    }

}
