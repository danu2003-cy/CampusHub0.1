package com.campushub.exception;

/**
 * Thrown when a login attempt has a missing/unknown email or a wrong password.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
