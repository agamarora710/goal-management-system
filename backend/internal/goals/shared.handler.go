package goals

import (
	"goal-management-system/internal/database"

	"github.com/gofiber/fiber/v2"
)

func CreateSharedGoal(c *fiber.Ctx) error {

	var body CreateSharedGoalRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	// Create master shared goal
	masterGoal := Goal{
		EmployeeID:     body.PrimaryOwnerID,
		Title:          body.Title,
		Description:    body.Description,
		GoalType:       body.GoalType,
		TargetValue:    body.TargetValue,
		Weightage:      0,
		Status:         "Shared",
		Shared:         true,
		PrimaryOwnerID: body.PrimaryOwnerID,
	}

	database.DB.Create(&masterGoal)

	// Create copies for employees
	for _, employeeID := range body.EmployeeIDs {

		goal := Goal{
			EmployeeID:     employeeID,
			Title:          body.Title,
			Description:    body.Description,
			GoalType:       body.GoalType,
			TargetValue:    body.TargetValue,
			Weightage:      10,
			Status:         "Assigned",
			Shared:         true,
			SharedGoalID:   masterGoal.ID,
			PrimaryOwnerID: body.PrimaryOwnerID,
		}

		database.DB.Create(&goal)
	}

	return c.JSON(fiber.Map{
		"message": "Shared goal created successfully",
		"goal":    masterGoal,
	})
}
