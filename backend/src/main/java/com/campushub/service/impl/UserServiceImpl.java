package com.campushub.service.impl;

import com.campushub.dto.UserDto;
import com.campushub.entity.User;
import com.campushub.exception.ResourceNotFoundException;
import com.campushub.repository.UserRepository;
import com.campushub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of UserService.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = findUserById(id);
        return mapToDto(user);
    }

    @Override
    public UserDto createUser(UserDto userDto) {

        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User savedUser = userRepository.save(mapToEntity(userDto));
        return mapToDto(savedUser);
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {

        Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());

        if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = findUserById(id);
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setRole(User.Role.valueOf(userDto.getRole()));

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    /**
     * Converts a UserDto into a User entity.
     *
     * @param userDto DTO object
     * @return entity representation
     */
    private User mapToEntity(UserDto userDto) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Converts a User entity into a UserDto.
     *
     * @param user entity object
     * @return DTO representation
     */
    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name()
        );
    }

    /**
     * Converts a UserDto into a User entity.
     *
     * @param userDto DTO object
     * @return entity representation
     */
    private User mapToEntity(UserDto userDto) {
        return new User(
                userDto.getId(),
                userDto.getName(),
                userDto.getEmail(),
                userDto.getPassword(),
                User.Role.valueOf(userDto.getRole())
        );
    }
}
