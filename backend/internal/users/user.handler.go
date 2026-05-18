package users

import (
	"goal-management-system/internal/database"

	"github.com/gofiber/fiber/v2"
)

func GetAllUsers(c *fiber.Ctx) error {
	var users []User
	database.DB.Find(&users)
	return c.JSON(fiber.Map{"users": users})
}
