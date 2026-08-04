package com.campushub.service;

import com.campushub.dto.UserDto;

import java.util.List;

/**
 * Service contract for User management.
 */
public interface UserService {

    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    UserDto createUser(UserDto userDto);

    UserDto authenticate(String email, String password);

    UserDto updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);
}
