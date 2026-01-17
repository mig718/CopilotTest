package com.copilot.login.repository;

import com.copilot.login.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @BeforeEach
    void setUp() {
        mongoTemplate.dropCollection("users");
    }

    @Test
    void testSaveUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("hashedpassword");
        user.setFirstName("John");
        user.setLastName("Doe");

        User savedUser = userRepository.save(user);

        assertNotNull(savedUser.getId());
        assertEquals("test@example.com", savedUser.getEmail());
    }

    @Test
    void testFindByEmail() {
        User user = new User();
        user.setEmail("search@example.com");
        user.setPassword("hashedpassword");
        user.setFirstName("Search");
        user.setLastName("User");
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail("search@example.com");

        assertTrue(foundUser.isPresent());
        assertEquals("search@example.com", foundUser.get().getEmail());
    }

    @Test
    void testFindByEmailNotFound() {
        Optional<User> foundUser = userRepository.findByEmail("notfound@example.com");
        assertTrue(foundUser.isEmpty());
    }

    @Test
    void testExistsByEmail() {
        User user = new User();
        user.setEmail("exists@example.com");
        user.setPassword("hashedpassword");
        user.setFirstName("Exists");
        user.setLastName("User");
        userRepository.save(user);

        assertTrue(userRepository.existsByEmail("exists@example.com"));
        assertFalse(userRepository.existsByEmail("notexists@example.com"));
    }

    @Test
    void testSaveMultipleUsers() {
        for (int i = 0; i < 5; i++) {
            User user = new User();
            user.setEmail("user" + i + "@example.com");
            user.setPassword("password" + i);
            user.setFirstName("First" + i);
            user.setLastName("Last" + i);
            userRepository.save(user);
        }

        assertEquals(5, userRepository.count());
    }

    @Test
    void testUpdateUser() {
        User user = new User();
        user.setEmail("update@example.com");
        user.setPassword("originalpassword");
        user.setFirstName("Original");
        user.setLastName("Name");
        User savedUser = userRepository.save(user);

        // Update user
        savedUser.setFirstName("Updated");
        savedUser.setLastName("User");
        savedUser.setPassword("newpassword");
        userRepository.save(savedUser);

        User updatedUser = userRepository.findByEmail("update@example.com").orElse(null);
        assertNotNull(updatedUser);
        assertEquals("Updated", updatedUser.getFirstName());
        assertEquals("User", updatedUser.getLastName());
        assertEquals("newpassword", updatedUser.getPassword());
    }

    @Test
    void testDeleteUser() {
        User user = new User();
        user.setEmail("delete@example.com");
        user.setPassword("password");
        user.setFirstName("Delete");
        user.setLastName("Me");
        User savedUser = userRepository.save(user);

        userRepository.deleteById(savedUser.getId());

        Optional<User> deletedUser = userRepository.findByEmail("delete@example.com");
        assertTrue(deletedUser.isEmpty());
    }

    @Test
    void testUserEmailIsUnique() {
        User user1 = new User();
        user1.setEmail("unique@example.com");
        user1.setPassword("password1");
        user1.setFirstName("User");
        user1.setLastName("One");
        userRepository.save(user1);

        // Email should already exist
        assertTrue(userRepository.existsByEmail("unique@example.com"));
    }

    @Test
    void testUserTimestamps() {
        User user = new User();
        user.setEmail("timestamp@example.com");
        user.setPassword("password");
        user.setFirstName("Timestamp");
        user.setLastName("Test");

        long beforeSave = System.currentTimeMillis();
        User savedUser = userRepository.save(user);
        long afterSave = System.currentTimeMillis();

        assertNotNull(savedUser.getCreatedAt());
        assertNotNull(savedUser.getUpdatedAt());
        assertTrue(savedUser.getCreatedAt() >= beforeSave);
        assertTrue(savedUser.getCreatedAt() <= afterSave);
    }

    @Test
    void testUserActiveFlag() {
        User user = new User();
        user.setEmail("active@example.com");
        user.setPassword("password");
        user.setFirstName("Active");
        user.setLastName("User");

        User savedUser = userRepository.save(user);

        assertTrue(savedUser.getActive());
    }

}
