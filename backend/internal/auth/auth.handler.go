package auth

import (
	"os"
	"time"

	"goal-management-system/internal/database"
	"goal-management-system/internal/users"

	"github.com/golang-jwt/jwt/v5"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// REGISTER
func Register(c *fiber.Ctx) error {

	var body RegisterRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(body.Password),
		14,
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Password hashing failed",
		})
	}

	user := users.User{
		Name:       body.Name,
		Email:      body.Email,
		Password:   string(hashedPassword),
		Role:       body.Role,
		Department: body.Department,
		ManagerID:  body.ManagerID,
	}

	result := database.DB.Create(&user)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User registered successfully",
	})
}

// LOGIN
func Login(c *fiber.Ctx) error {

	var body LoginRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	var user users.User

	result := database.DB.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Compare Password
	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(body.Password),
	)

	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Create JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID,
		"role":   user.Role,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	})

	jwtSecret := os.Getenv("JWT_SECRET")

	t, err := token.SignedString([]byte(jwtSecret))

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Cannot generate token",
		})
	}

	return c.JSON(fiber.Map{
		"token": t,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
func GetManagers(c *fiber.Ctx) error {
	var managers []users.User
	database.DB.Where("role = ?", "manager").Find(&managers)
	return c.JSON(fiber.Map{"managers": managers})
}
