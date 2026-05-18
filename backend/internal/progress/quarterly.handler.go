package progress

import (
	"math"

	"goal-management-system/internal/database"
	"goal-management-system/internal/goals"

	"github.com/gofiber/fiber/v2"
)

func CreateQuarterlyUpdate(c *fiber.Ctx) error {

	goalId := c.Params("id")

	var goal goals.Goal

	result := database.DB.First(&goal, goalId)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	var body CreateQuarterlyUpdateRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	progressValue := 0.0

	switch goal.GoalType {

	case "NUMERIC_MAX":

		if body.PlannedValue > 0 {
			progressValue =
				(body.ActualValue / body.PlannedValue) * 100
		}

	case "NUMERIC_MIN":

		if body.ActualValue > 0 {
			progressValue =
				(body.PlannedValue / body.ActualValue) * 100
		}

	case "ZERO":

		if body.ActualValue == 0 {
			progressValue = 100
		} else {
			progressValue = 0
		}
	}

	if progressValue > 100 {
		progressValue = 100
	}

	progressValue =
		math.Round(progressValue*100) / 100

	update := QuarterlyUpdate{
		GoalID:       goal.ID,
		Quarter:      body.Quarter,
		PlannedValue: body.PlannedValue,
		ActualValue:  body.ActualValue,
		Progress:     progressValue,
		Status:       body.Status,
	}

	database.DB.Create(&update)

	return c.JSON(fiber.Map{
		"message": "Quarterly update created",
		"update":  update,
	})
}

func GetMyQuarterlyUpdates(c *fiber.Ctx) error {
	userId := uint(c.Locals("userId").(float64))

	type UpdateWithGoal struct {
		ID             uint    `json:"id"`
		GoalID         uint    `json:"goalId"`
		GoalTitle      string  `json:"goalTitle"`
		Quarter        string  `json:"quarter"`
		PlannedValue   float64 `json:"plannedValue"`
		ActualValue    float64 `json:"actualValue"`
		Progress       float64 `json:"progress"`
		Status         string  `json:"status"`
		ManagerComment string  `json:"managerComment"`
	}

	var updates []UpdateWithGoal

	database.DB.Raw(`
		SELECT
			quarterly_updates.id,
			quarterly_updates.goal_id,
			goals.title as goal_title,
			quarterly_updates.quarter,
			quarterly_updates.planned_value,
			quarterly_updates.actual_value,
			quarterly_updates.progress,
			quarterly_updates.status,
			quarterly_updates.manager_comment
		FROM quarterly_updates
		JOIN goals ON goals.id = quarterly_updates.goal_id
		WHERE goals.employee_id = ?
	`, userId).Scan(&updates)

	return c.JSON(fiber.Map{"updates": updates})
}

func GetTeamQuarterlyUpdates(c *fiber.Ctx) error {
	managerId := uint(c.Locals("userId").(float64))

	type TeamUpdate struct {
		ID             uint    `json:"id"`
		GoalID         uint    `json:"goalId"`
		GoalTitle      string  `json:"goalTitle"`
		EmployeeName   string  `json:"employeeName"`
		Quarter        string  `json:"quarter"`
		PlannedValue   float64 `json:"plannedValue"`
		ActualValue    float64 `json:"actualValue"`
		Progress       float64 `json:"progress"`
		Status         string  `json:"status"`
		ManagerComment string  `json:"managerComment"`
	}

	var updates []TeamUpdate

	database.DB.Raw(`
		SELECT
			quarterly_updates.id,
			quarterly_updates.goal_id,
			goals.title as goal_title,
			users.name as employee_name,
			quarterly_updates.quarter,
			quarterly_updates.planned_value,
			quarterly_updates.actual_value,
			quarterly_updates.progress,
			quarterly_updates.status,
			quarterly_updates.manager_comment
		FROM quarterly_updates
		JOIN goals ON goals.id = quarterly_updates.goal_id
		JOIN users ON users.id = goals.employee_id
		WHERE users.manager_id = ?
	`, managerId).Scan(&updates)

	return c.JSON(fiber.Map{"updates": updates})
}

func AddManagerComment(c *fiber.Ctx) error {
	updateId := c.Params("id")

	type CommentRequest struct {
		Comment string `json:"comment"`
	}

	var body CommentRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	var update QuarterlyUpdate
	result := database.DB.First(&update, updateId)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Update not found"})
	}

	update.ManagerComment = body.Comment
	database.DB.Save(&update)

	return c.JSON(fiber.Map{
		"message": "Comment added",
		"update":  update,
	})
}
