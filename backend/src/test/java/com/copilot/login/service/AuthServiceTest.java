package com.copilot.login.service;

import com.copilot.login.dto.LoginRequest;
import com.copilot.login.dto.LoginResponse;
import com.copilot.login.dto.SignupRequest;
import com.copilot.login.dto.SignupResponse;
import com.copilot.login.model.User;
import com.copilot.login.repository.UserRepository;
import com.copilot.login.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        mongoTemplate.dropCollection("users");
    }

    // ==================== LOGIN TESTS ====================

    @Test
    void testLoginSuccess() {
        // Create a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("John");
        user.setLastName("Doe");
        userRepository.save(user);

        // Test login
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        LoginResponse response = authService.login(request);

        assertNotNull(response.getToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
    }

    @Test
    void testLoginWithInvalidPassword() {
        // Create a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("John");
        user.setLastName("Doe");
        userRepository.save(user);

        // Test login with wrong password
        LoginRequest request = new LoginRequest("test@example.com", "wrongpassword");
        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void testLoginWithNonexistentUser() {
        LoginRequest request = new LoginRequest("nonexistent@example.com", "password123");
        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void testLoginWithEmptyPassword() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("John");
        user.setLastName("Doe");
        userRepository.save(user);

        LoginRequest request = new LoginRequest("test@example.com", "");
        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    @Test
    void testLoginTokenIsValid() {
        User user = new User();
        user.setEmail("tokentest@example.com");
        user.setPassword(passwordEncoder.encode("pass123"));
        user.setFirstName("Token");
        user.setLastName("Tester");
        userRepository.save(user);

        LoginRequest request = new LoginRequest("tokentest@example.com", "pass123");
        LoginResponse response = authService.login(request);

        // Verify token is valid and contains correct email
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
        assertEquals("tokentest@example.com", 
                jwtTokenProvider.getEmailFromToken(response.getToken()));
    }

    // ==================== SIGNUP TESTS ====================

    @Test
    void testSignupSuccess() {
        SignupRequest request = new SignupRequest(
                "newuser@example.com",
                "password123",
                "Jane",
                "Doe"
        );

        SignupResponse response = authService.signup(request);

        assertNotNull(response.getId());
        assertEquals("newuser@example.com", response.getEmail());
        assertEquals("Jane", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertNotNull(response.getMessage());
    }

    @Test
    void testSignupWithDuplicateEmail() {
        // Create first user
        User user = new User();
        user.setEmail("duplicate@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("First");
        user.setLastName("User");
        userRepository.save(user);

        // Try to signup with same email - should throw exception
        SignupRequest request = new SignupRequest(
                "duplicate@example.com",
                "anotherpass",
                "Second",
                "User"
        );

        // The service should prevent duplicate emails
        assertThrows(RuntimeException.class, () -> authService.signup(request));
    }

    @Test
    void testSignupCreatesUserInDatabase() {
        SignupRequest request = new SignupRequest(
                "dbtest@example.com",
                "password123",
                "DB",
                "Test"
        );

        SignupResponse response = authService.signup(request);

        // Verify user exists in database
        User savedUser = userRepository.findByEmail("dbtest@example.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("dbtest@example.com", savedUser.getEmail());
        assertEquals("DB", savedUser.getFirstName());
        assertEquals("Test", savedUser.getLastName());
    }

    @Test
    void testSignupPasswordIsEncrypted() {
        SignupRequest request = new SignupRequest(
                "encrypt@example.com",
                "plainpassword",
                "Encrypt",
                "Test"
        );

        SignupResponse response = authService.signup(request);

        User savedUser = userRepository.findByEmail("encrypt@example.com").orElse(null);
        assertNotNull(savedUser);
        assertNotEquals("plainpassword", savedUser.getPassword());
        assertTrue(passwordEncoder.matches("plainpassword", savedUser.getPassword()));
    }

    @Test
    void testSignupWithEmptyEmail() {
        SignupRequest request = new SignupRequest(
                "",
                "password123",
                "Jane",
                "Doe"
        );

        // Empty email should be handled (may not throw, depending on validation)
        try {
            SignupResponse response = authService.signup(request);
            // If no exception, verify email is empty
            assertEquals("", response.getEmail());
        } catch (RuntimeException e) {
            // Exception is also acceptable
            assertNotNull(e.getMessage());
        }
    }

    @Test
    void testSignupMultipleUsers() {
        for (int i = 0; i < 3; i++) {
            SignupRequest request = new SignupRequest(
                    "user" + i + "@example.com",
                    "password" + i,
                    "First" + i,
                    "Last" + i
            );

            SignupResponse response = authService.signup(request);
            assertNotNull(response.getId());
        }

        // Verify all users were created
        assertTrue(userRepository.existsByEmail("user0@example.com"));
        assertTrue(userRepository.existsByEmail("user1@example.com"));
        assertTrue(userRepository.existsByEmail("user2@example.com"));
    }

    // ==================== GET USER TESTS ====================

    @Test
    void testGetUserByEmail() {
        User user = new User();
        user.setEmail("getuser@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("Get");
        user.setLastName("User");
        userRepository.save(user);

        User foundUser = authService.getUserByEmail("getuser@example.com");
        assertNotNull(foundUser);
        assertEquals("getuser@example.com", foundUser.getEmail());
    }

    @Test
    void testGetUserByEmailNotFound() {
        assertThrows(RuntimeException.class, () -> 
                authService.getUserByEmail("notfound@example.com"));
    }

    // ==================== INTEGRATION TESTS ====================

    @Test
    void testSignupThenLogin() {
        // Signup
        SignupRequest signupRequest = new SignupRequest(
                "integration@example.com",
                "integration123",
                "Integration",
                "Test"
        );
        SignupResponse signupResponse = authService.signup(signupRequest);
        assertNotNull(signupResponse.getId());

        // Login with same credentials
        LoginRequest loginRequest = new LoginRequest(
                "integration@example.com",
                "integration123"
        );
        LoginResponse loginResponse = authService.login(loginRequest);

        assertNotNull(loginResponse.getToken());
        assertEquals("integration@example.com", loginResponse.getEmail());
        assertTrue(jwtTokenProvider.validateToken(loginResponse.getToken()));
    }

    @Test
    void testMultipleUsersCanLoginIndependently() {
        // Create two users
        User user1 = new User();
        user1.setEmail("user1@example.com");
        user1.setPassword(passwordEncoder.encode("pass1"));
        user1.setFirstName("User");
        user1.setLastName("One");
        userRepository.save(user1);

        User user2 = new User();
        user2.setEmail("user2@example.com");
        user2.setPassword(passwordEncoder.encode("pass2"));
        user2.setFirstName("User");
        user2.setLastName("Two");
        userRepository.save(user2);

        // Login as both users
        LoginResponse response1 = authService.login(
                new LoginRequest("user1@example.com", "pass1"));
        LoginResponse response2 = authService.login(
                new LoginRequest("user2@example.com", "pass2"));

        // Verify both tokens are different and valid
        assertNotEquals(response1.getToken(), response2.getToken());
        assertTrue(jwtTokenProvider.validateToken(response1.getToken()));
        assertTrue(jwtTokenProvider.validateToken(response2.getToken()));
    }

}
