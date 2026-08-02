package com.campushub.controller;

import com.campushub.dto.RegistrationDto;
import com.campushub.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Registration management.
 * TODO (Member 5): wire up real responses once RegistrationServiceImpl is implemented.
 */
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping
    public ResponseEntity<List<RegistrationDto>> getAllRegistrations(){

        return ResponseEntity.ok(
                registrationService.getAllRegistrations()
        );

    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistrationDto> getRegistrationById(
            @PathVariable Long id
    ){

        return ResponseEntity.ok(
                registrationService.getRegistrationById(id)
        );

    }

    @PostMapping
    public ResponseEntity<RegistrationDto> createRegistration(@RequestBody RegistrationDto registrationDto) {
        return ResponseEntity.ok(registrationService.createRegistration(registrationDto));
    }


    @PutMapping("/{id}")
    public ResponseEntity<RegistrationDto> updateRegistration(
            @PathVariable Long id,
            @RequestBody RegistrationDto registrationDto
    ){

        return ResponseEntity.ok(
                registrationService.updateRegistration(
                        id,
                        registrationDto
                )
        );

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(
            @PathVariable Long id
    ){

        registrationService.deleteRegistration(id);

        return ResponseEntity.noContent().build();

    }
}
