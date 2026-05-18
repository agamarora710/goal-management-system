package progress

import (
	"goal-management-system/internal/database"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func AddCheckIn(c *fiber.Ctx) error {

	goalId := c.Params("id")

	managerId := c.Locals("userId")

	var body CreateCheckInRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	checkin := CheckIn{
		GoalID:    uint(ParseStringToUint(goalId)),
		ManagerID: uint(managerId.(float64)),
		Comment:   body.Comment,
		Quarter:   body.Quarter,
	}

	database.DB.Create(&checkin)

	return c.JSON(fiber.Map{
		"message": "Check-in added successfully",
		"checkin": checkin,
	})
}
func ParseStringToUint(value string) uint {

	number, _ := strconv.ParseUint(value, 10, 64)

	return uint(number)
}
