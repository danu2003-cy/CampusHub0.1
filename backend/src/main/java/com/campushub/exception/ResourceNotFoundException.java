package com.campushub.exception;

/**
 * Thrown when a requested resource (User, Club, Event, etc.) cannot be found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
