# Login Microservice

A Spring Boot microservice for user authentication and authorization.

## Features

- User registration (signup)
- User login with JWT authentication
- Password encryption with BCrypt
- MongoDB database integration
- RESTful API endpoints
- CORS enabled
- Health check endpoint

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MongoDB 4.4 or higher

## Quick Start

### 1. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS (Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 2. Clone/Navigate to Project

```bash
cd CopilotBackendTest
```

### 3. Build the Project

```bash
mvn clean package -DskipTests
```

Or with tests:

```bash
mvn clean package
```

### 4. Run the Application

```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using the JAR file
java -jar target/login-service-1.0.0.jar
```

The application will start on `http://localhost:8081`

## Database Setup

The application automatically creates the `login_db` database and `users` collection on first run.

### Configuration

Update `src/main/resources/application.properties` if needed:

```properties
# Local MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/login_db

# MongoDB Atlas (cloud)
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/login_db
```

## Build Instructions

### Clean Build
Remove all compiled files and rebuild from scratch:

```bash
mvn clean package
```

### Build Phases

```bash
# Compile only
mvn compile

# Compile and run tests
mvn test

# Compile, test, and package
mvn package

# Compile, test, package, and install to local repository
mvn install
```

### Build with Maven Wrapper

If Maven is not installed, use the included Maven Wrapper:

```bash
# Windows
./mvnw.cmd clean package

# Linux/macOS
./mvnw clean package
```

### Build Output

The compiled JAR file is located at: `target/login-service-1.0.0.jar`

## Testing Instructions

### Run All Tests

```bash
mvn test
```

### Run Specific Test Class

```bash
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=AuthControllerTest
mvn test -Dtest=JwtTokenProviderTest
mvn test -Dtest=UserRepositoryTest
mvn test -Dtest=UserTest
```

### Run Specific Test Method

```bash
mvn test -Dtest=AuthServiceTest#testLoginSuccess
mvn test -Dtest=AuthServiceTest#testSignupSuccess
```

### Run Tests with Coverage

```bash
mvn test jacoco:report
```

### Test Output

Test results are generated in: `target/surefire-reports/`

### Available Test Suites

- **AuthServiceTest** (15 tests) - Authentication service logic
- **AuthControllerTest** (3 tests) - REST endpoint testing
- **JwtTokenProviderTest** (11 tests) - JWT token generation and validation
- **UserRepositoryTest** (10 tests) - Database operations
- **UserTest** (14 tests) - User model testing
- **LoginServiceApplicationTest** (1 test) - Application context loading

**Total: 56 Unit Tests - All Passing ✓**

## Running the Application

### Using Maven

```bash
mvn spring-boot:run
```

This will:
1. Compile the code
2. Run tests
3. Start the application on port 8081

To skip tests:

```bash
mvn spring-boot:run -DskipTests
```

### Using JAR File

First, build the project:

```bash
mvn clean package -DskipTests
```

Then run:

```bash
java -jar target/login-service-1.0.0.jar
```

### Using IDE

Import the project into your IDE (IntelliJ IDEA, Eclipse, VS Code) and run the `LoginServiceApplication` class directly.

### Verify Application is Running

```bash
curl http://localhost:8081/api/auth/health
```

Expected response: `Login service is running`

## Configuration

## API Endpoints

### Health Check
- **GET** `/api/auth/health` - Check if service is running

### Signup
- **POST** `/api/auth/signup`
- Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
- **POST** `/api/auth/login`
- Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- Response:
```json
{
  "token": "jwt-token-here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "expiresIn": 86400000
}
```

## Configuration

All application settings are in `src/main/resources/application.properties`:

```properties
# Application
spring.application.name=login-service
server.port=8081

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/login_db

# JWT Configuration
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidationPurposesOnly123456789
jwt.expiration=86400000  # 24 hours

# Logging
logging.level.root=INFO
logging.level.com.copilot=DEBUG
```

## Troubleshooting

### MongoDB Connection Error

**Error:** `Connection refused`

**Solution:** Ensure MongoDB is running:
```bash
mongod
```

Or check if it's running on a different port and update the URI in `application.properties`.

### Port Already in Use

**Error:** `Address already in use`

**Solution:** Change the port in `application.properties`:
```properties
server.port=8082
```

Or kill the process using port 8081:
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8081
kill -9 <PID>
```

### Tests Failing

**Error:** Tests fail with MongoDB connection errors

**Solution:** Ensure MongoDB is running before executing tests:
```bash
mongod &  # Start in background
mvn test
```

### Build Failure

**Error:** `COMPILATION ERROR` or dependency issues

**Solution:** 
```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:resolve

# Rebuild
mvn clean package
```

## Development Workflow

### 1. Make Code Changes

Edit files in `src/main/java`

### 2. Run Tests

```bash
mvn test
```

### 3. Build Project

```bash
mvn clean package
```

### 4. Start Application

```bash
mvn spring-boot:run
```

### 5. Test Endpoints

```bash
# Test signup
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Test login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Test health
curl http://localhost:8081/api/auth/health
```

## Performance & Optimization

### Run in Production Mode

```bash
java -jar target/login-service-1.0.0.jar \
  -Dspring.profiles.active=production \
  -Dspring.data.mongodb.uri=<PRODUCTION_MONGODB_URI>
```

### Optimize Build Size

```bash
mvn clean package -DskipTests -Pproduction
```

### Memory Configuration

```bash
java -Xmx512m -Xms256m -jar target/login-service-1.0.0.jar
```

## Integration Testing

### Test with Real Database

```bash
# This runs against actual MongoDB
mvn test
```

### Test with Mocked Database

Create a test profile in `application-test.properties` and use:
```bash
mvn test -Dspring.profiles.active=test
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:4.4
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Build and test
        run: mvn clean package
```

## Docker Support (Optional)

### Create Dockerfile

```dockerfile
FROM eclipse-temurin:17-jre-alpine
COPY target/login-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Build and Run Docker Image

```bash
# Build
docker build -t login-service:1.0.0 .

# Run with MongoDB
docker run -p 8081:8081 \
  -e spring.data.mongodb.uri=mongodb://host.docker.internal:27017/login_db \
  login-service:1.0.0
```

```
src/
├── main/
│   ├── java/com/copilot/login/
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic
│   │   ├── model/            # Entity models
│   │   ├── repository/       # Data access
│   │   ├── security/         # JWT and security
│   │   ├── config/           # Spring configuration
│   │   └── dto/              # Data transfer objects
│   └── resources/
│       └── application.properties
└── test/                     # Unit tests
```

## Technologies

- Spring Boot 3.1.5
- Spring Security
- Spring Data MongoDB
- MongoDB
- JJWT (JWT library)
- Lombok
- JUnit 5

## License

MIT
