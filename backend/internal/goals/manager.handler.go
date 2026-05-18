package goals

import (
	"goal-management-system/internal/audit"
	"goal-management-system/internal/database"
	"goal-management-system/internal/users"

	"github.com/gofiber/fiber/v2"
)

func GetSubmittedGoals(c *fiber.Ctx) error {
	managerId := uint(c.Locals("userId").(float64))

	type SubmittedGoal struct {
		ID           uint    `json:"id"`
		Title        string  `json:"title"`
		Weightage    float64 `json:"weightage"`
		EmployeeName string  `json:"employeeName"`
	}

	var goals []SubmittedGoal

	database.DB.Raw(`
		SELECT
			goals.id,
			goals.title,
			goals.weightage,
			users.name as employee_name
		FROM goals
		JOIN users ON users.id = goals.employee_id
		WHERE goals.submitted = true
		AND goals.approved = false
		AND users.manager_id = ?
	`, managerId).Scan(&goals)

	return c.JSON(fiber.Map{"goals": goals})
}
func ApproveGoal(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	goal.Approved = true
	goal.Status = "Approved"
	goal.Locked = true

	database.DB.Save(&goal)

	managerId := uint(c.Locals("userId").(float64))

	audit.CreateAuditLog(
		managerId,
		"APPROVED_GOAL",
		"goal",
		goal.ID,
	)

	return c.JSON(fiber.Map{
		"message": "Goal approved successfully",
		"goal":    goal,
	})
}

func RejectGoal(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	goal.Approved = false
	goal.Submitted = false
	goal.Locked = false
	goal.Status = "Rework Required"

	database.DB.Save(&goal)

	return c.JSON(fiber.Map{
		"message": "Goal sent for rework",
		"goal":    goal,
	})
}
func UpdateGoalByManager(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	// Cannot edit approved locked goals
	if goal.Locked {
		return c.Status(403).JSON(fiber.Map{
			"error": "Goal already locked",
		})
	}

	type UpdateRequest struct {
		TargetValue float64 `json:"targetValue"`
		Weightage   float64 `json:"weightage"`
	}

	var body UpdateRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	// Validation
	if body.Weightage < 10 {
		return c.Status(400).JSON(fiber.Map{
			"error": "Minimum weightage is 10%",
		})
	}

	// Get all goals of employee
	var goals []Goal

	database.DB.Where(
		"employee_id = ?",
		goal.EmployeeID,
	).Find(&goals)

	// Calculate new total weightage
	totalWeightage := body.Weightage

	for _, g := range goals {

		// Skip current goal
		if g.ID != goal.ID {
			totalWeightage += g.Weightage
		}
	}

	// Validate total
	if totalWeightage > 100 {
		return c.Status(400).JSON(fiber.Map{
			"error": "Total weightage cannot exceed 100%",
		})
	}

	// Update values
	goal.TargetValue = body.TargetValue
	goal.Weightage = body.Weightage
	database.DB.Save(&goal)

	return c.JSON(fiber.Map{
		"message": "Goal updated by manager",
		"goal":    goal,
	})
}
func GetTeamDashboard(c *fiber.Ctx) error {

	managerId := uint(c.Locals("userId").(float64))

	var manager users.User

	database.DB.First(&manager, managerId)

	var dashboard []TeamDashboardResponse

	database.DB.
		Table("quarterly_updates").
		Select(`
	users.name as employee_name,
	users.department as department,
	goals.title as goal_title,
	goals.weightage as weightage,
	quarterly_updates.quarter as quarter,
	quarterly_updates.planned_value as planned_value,
	quarterly_updates.actual_value as actual_value,
	quarterly_updates.progress as progress,
	quarterly_updates.status as status,
	goals.id as id
`).
		Joins("JOIN goals ON goals.id = quarterly_updates.goal_id").
		Joins("JOIN users ON users.id = goals.employee_id").
		Where(
			"users.department = ?",
			manager.Department,
		).
		Scan(&dashboard)

	return c.JSON(fiber.Map{
		"dashboard": dashboard,
	})
}

func GetApprovedGoals(c *fiber.Ctx) error {
	managerId := uint(c.Locals("userId").(float64))

	type ApprovedGoal struct {
		ID           uint    `json:"id"`
		Title        string  `json:"title"`
		Weightage    float64 `json:"weightage"`
		Progress     float64 `json:"progress"`
		Status       string  `json:"status"`
		EmployeeName string  `json:"employeeName"`
	}

	var goals []ApprovedGoal

	database.DB.Raw(`
		SELECT
			goals.id,
			goals.title,
			goals.weightage,
			goals.progress,
			goals.status,
			users.name as employee_name
		FROM goals
		JOIN users ON users.id = goals.employee_id
		WHERE goals.approved = true
		AND users.manager_id = ?
	`, managerId).Scan(&goals)

	return c.JSON(fiber.Map{"goals": goals})
}

func GetDepartmentEmployees(c *fiber.Ctx) error {
	managerId := uint(c.Locals("userId").(float64))

	var employees []users.User
	database.DB.Where("manager_id = ?", managerId).Find(&employees)

	return c.JSON(fiber.Map{"employees": employees})
}

func UpdateSharedGoalWeightage(c *fiber.Ctx) error {
	id := c.Params("id")

	var goal Goal
	result := database.DB.First(&goal, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Goal not found"})
	}

	if !goal.Shared {
		return c.Status(400).JSON(fiber.Map{"error": "Not a shared goal"})
	}

	type WeightageRequest struct {
		Weightage float64 `json:"weightage"`
	}

	var body WeightageRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if body.Weightage < 10 {
		return c.Status(400).JSON(fiber.Map{"error": "Minimum weightage is 10%"})
	}

	goal.Weightage = body.Weightage
	database.DB.Save(&goal)

	return c.JSON(fiber.Map{"message": "Weightage updated", "goal": goal})
}
