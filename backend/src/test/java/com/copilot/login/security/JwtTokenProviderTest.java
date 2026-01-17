package com.copilot.login.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String testEmail;
    private String validToken;

    @BeforeEach
    void setUp() {
        testEmail = "test@example.com";
        validToken = jwtTokenProvider.generateToken(testEmail);
    }

    @Test
    void testGenerateToken() {
        String token = jwtTokenProvider.generateToken(testEmail);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGenerateTokenWithDifferentEmails() {
        String token1 = jwtTokenProvider.generateToken("user1@example.com");
        String token2 = jwtTokenProvider.generateToken("user2@example.com");

        assertNotEquals(token1, token2);
    }

    @Test
    void testGetEmailFromToken() {
        String extractedEmail = jwtTokenProvider.getEmailFromToken(validToken);
        assertEquals(testEmail, extractedEmail);
    }

    @Test
    void testValidateTokenSuccess() {
        assertTrue(jwtTokenProvider.validateToken(validToken));
    }

    @Test
    void testValidateTokenWithInvalidToken() {
        String invalidToken = "invalid.token.here";
        assertFalse(jwtTokenProvider.validateToken(invalidToken));
    }

    @Test
    void testValidateTokenWithEmptyToken() {
        assertFalse(jwtTokenProvider.validateToken(""));
    }

    @Test
    void testValidateTokenWithNullToken() {
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    void testTokenContainsEmail() {
        String token = jwtTokenProvider.generateToken("special@example.com");
        String email = jwtTokenProvider.getEmailFromToken(token);
        assertEquals("special@example.com", email);
    }

    @Test
    void testMultipleTokenGeneration() {
        for (int i = 0; i < 5; i++) {
            String token = jwtTokenProvider.generateToken(testEmail);
            assertTrue(jwtTokenProvider.validateToken(token));
            assertEquals(testEmail, jwtTokenProvider.getEmailFromToken(token));
        }
    }

    @Test
    void testGetExpirationTime() {
        long expirationTime = jwtTokenProvider.getExpirationTime();
        assertTrue(expirationTime > 0);
        assertEquals(86400000L, expirationTime); // 24 hours in milliseconds
    }

    @Test
    void testTokenWithSpecialCharactersInEmail() {
        String specialEmail = "test+special@example.co.uk";
        String token = jwtTokenProvider.generateToken(specialEmail);
        
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(specialEmail, jwtTokenProvider.getEmailFromToken(token));
    }

}
