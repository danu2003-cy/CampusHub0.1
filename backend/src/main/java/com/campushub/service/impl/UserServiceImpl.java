package com.campushub.service.impl;

import com.campushub.dto.UserDto;
import com.campushub.entity.User;
import com.campushub.exception.InvalidCredentialsException;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.UserRepository;
import com.campushub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of UserService with full CRUD and entity/DTO mapping.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already in use: " + userDto.getEmail());
        }

        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setRole(resolveRole(userDto.getRole()));

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public UserDto authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        return convertToDto(user);
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (userDto.getName() != null && !userDto.getName().trim().isEmpty()) {
            existingUser.setName(userDto.getName());
        }

        if (userDto.getEmail() != null && !userDto.getEmail().trim().isEmpty()) {
            // Check if the new email is already taken by another user
            if (!existingUser.getEmail().equals(userDto.getEmail())
                    && userRepository.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("Email already in use: " + userDto.getEmail());
            }
            existingUser.setEmail(userDto.getEmail());
        }

        if (userDto.getPassword() != null && !userDto.getPassword().trim().isEmpty()) {
            existingUser.setPassword(userDto.getPassword());
        }

        if (userDto.getRole() != null) {
            existingUser.setRole(resolveRole(userDto.getRole()));
        }

        User updatedUser = userRepository.save(existingUser);
        return convertToDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        // password is excluded from responses via @JsonProperty(access = WRITE_ONLY)
        dto.setRole(user.getRole().name());
        return dto;
    }

    private User.Role resolveRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            return User.Role.STUDENT;
        }
        try {
            return User.Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return User.Role.STUDENT;
        }
    }
}
