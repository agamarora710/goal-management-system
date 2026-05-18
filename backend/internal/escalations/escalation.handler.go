package escalations

import (
	"goal-management-system/internal/database"
	"goal-management-system/internal/users"

	"github.com/gofiber/fiber/v2"
)

type ManagerEscalationResponse struct {
	ID              uint
	UserID          uint
	EmployeeName    string
	Type            string
	Message         string
	Status          string
	EscalationLevel int
	CreatedAt       string
}

// Used by HR / Admin — returns all escalations
func GetEscalations(c *fiber.Ctx) error {

	var escalations []Escalation

	database.DB.
		Order("created_at desc").
		Find(&escalations)

	var response []EscalationResponse

	for _, esc := range escalations {

		var user users.User
		var escalatedTo users.User

		database.DB.First(&user, esc.UserID)
		database.DB.First(&escalatedTo, esc.EscalatedTo)

		response = append(
			response,
			EscalationResponse{
				ID:              esc.ID,
				UserName:        user.Name,
				Type:            esc.Type,
				Message:         esc.Message,
				Status:          esc.Status,
				EscalatedToName: escalatedTo.Name,
				EscalationLevel: esc.EscalationLevel,
				CreatedAt:       esc.CreatedAt.Format("02/01/2006"),
			},
		)
	}

	return c.JSON(fiber.Map{
		"escalations": response,
	})
}

// Used by Manager — returns only escalations assigned to them
func GetManagerEscalations(c *fiber.Ctx) error {

	userID := c.Locals("userId")

	if userID == nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	managerID := uint(userID.(float64))

	var escalations []Escalation

	database.DB.
		Where(
			"escalated_to = ? AND status = ?",
			managerID,
			"open",
		).
		Order("created_at desc").
		Find(&escalations)

	var response []ManagerEscalationResponse

	for _, esc := range escalations {

		var employee users.User

		database.DB.
			First(&employee, esc.UserID)

		response = append(
			response,
			ManagerEscalationResponse{
				ID:              esc.ID,
				UserID:          esc.UserID,
				EmployeeName:    employee.Name,
				Type:            esc.Type,
				Message:         esc.Message,
				Status:          esc.Status,
				EscalationLevel: esc.EscalationLevel,
				CreatedAt:       esc.CreatedAt.Format("02/01/2006"),
			},
		)
	}

	return c.JSON(fiber.Map{
		"escalations": response,
	})
}
