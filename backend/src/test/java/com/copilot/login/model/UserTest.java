package com.copilot.login.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserCreation() {
        User user = new User();
        user.setId("507f1f77bcf86cd799439011");
        user.setEmail("test@example.com");
        user.setPassword("hashedpassword");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setActive(true);

        assertEquals("507f1f77bcf86cd799439011", user.getId());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("hashedpassword", user.getPassword());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertTrue(user.getActive());
    }

    @Test
    void testUserConstructorWithAllParameters() {
        User user = new User(
                "507f1f77bcf86cd799439011",
                "test@example.com",
                "hashedpassword",
                "Jane",
                "Doe",
                true,
                System.currentTimeMillis(),
                System.currentTimeMillis()
        );

        assertEquals("507f1f77bcf86cd799439011", user.getId());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("hashedpassword", user.getPassword());
        assertEquals("Jane", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertTrue(user.getActive());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
    }

    @Test
    void testUserDefaultValues() {
        User user = new User();

        assertNull(user.getId());
        assertNull(user.getEmail());
        assertNull(user.getPassword());
        assertNull(user.getFirstName());
        assertNull(user.getLastName());
        assertTrue(user.getActive());
        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
    }

    @Test
    void testUserEquality() {
        User user1 = new User();
        user1.setId("507f1f77bcf86cd799439011");
        user1.setEmail("test@example.com");

        User user2 = new User();
        user2.setId("507f1f77bcf86cd799439011");
        user2.setEmail("test@example.com");

        assertEquals(user1, user2);
    }

    @Test
    void testUserInequality() {
        User user1 = new User();
        user1.setId("507f1f77bcf86cd799439011");
        user1.setEmail("test1@example.com");

        User user2 = new User();
        user2.setId("507f1f77bcf86cd799439012");
        user2.setEmail("test2@example.com");

        assertNotEquals(user1, user2);
    }

    @Test
    void testUserEmailModification() {
        User user = new User();
        user.setEmail("original@example.com");

        assertEquals("original@example.com", user.getEmail());

        user.setEmail("modified@example.com");

        assertEquals("modified@example.com", user.getEmail());
    }

    @Test
    void testUserPasswordModification() {
        User user = new User();
        user.setPassword("originalpassword");

        assertEquals("originalpassword", user.getPassword());

        user.setPassword("newpassword");

        assertEquals("newpassword", user.getPassword());
    }

    @Test
    void testUserActiveToggle() {
        User user = new User();
        assertTrue(user.getActive());

        user.setActive(false);
        assertFalse(user.getActive());

        user.setActive(true);
        assertTrue(user.getActive());
    }

    @Test
    void testUserTimestamps() {
        long beforeCreation = System.currentTimeMillis();
        User user = new User();
        long afterCreation = System.currentTimeMillis();

        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
        assertTrue(user.getCreatedAt() >= beforeCreation);
        assertTrue(user.getCreatedAt() <= afterCreation);
        assertEquals(user.getCreatedAt(), user.getUpdatedAt());
    }

    @Test
    void testUserToString() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");

        String userString = user.toString();
        assertNotNull(userString);
        assertTrue(userString.contains("test@example.com") || 
                   userString.contains("User"));
    }

}
