package goals

import (
	"goal-management-system/internal/database"
	"math"

	"github.com/gofiber/fiber/v2"
)

func CreateGoal(c *fiber.Ctx) error {

	var body CreateGoalRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	userId := c.Locals("userId")

	goal := Goal{
		EmployeeID:  uint(userId.(float64)),
		Title:       body.Title,
		Description: body.Description,
		GoalType:    body.GoalType,
		TargetValue: body.TargetValue,
		Weightage:   body.Weightage,
		Status:      "Pending Approval",
		Approved:    false,
	}

	result := database.DB.Create(&goal)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Goal created successfully",
		"goal":    goal,
	})
}
func SubmitGoals(c *fiber.Ctx) error {

	userId := c.Locals("userId")
	employeeId := uint(userId.(float64))

	var goals []Goal

	database.DB.Where(
		"employee_id = ?",
		employeeId,
	).Find(&goals)

	// No goals check
	if len(goals) == 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "No goals found",
		})
	}

	// Max 8 goals
	if len(goals) > 8 {
		return c.Status(400).JSON(fiber.Map{
			"error": "Maximum 8 goals allowed",
		})
	}

	totalWeightage := 0.0

	for _, goal := range goals {

		// Minimum 10%
		if goal.Weightage < 10 {
			return c.Status(400).JSON(fiber.Map{
				"error": "Each goal must have minimum 10% weightage",
			})
		}

		totalWeightage += goal.Weightage
	}

	// EXACTLY 100%
	if totalWeightage != 100 {
		return c.Status(400).JSON(fiber.Map{
			"error": "Total weightage must equal exactly 100%",
		})
	}

	// Mark goals submitted
	database.DB.Model(&Goal{}).
		Where("employee_id = ?", employeeId).
		Update("submitted", true)

	return c.JSON(fiber.Map{
		"message": "Goals submitted successfully",
	})
}
func UpdateGoal(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	// BLOCK EDITS
	if goal.Locked {
		return c.Status(403).JSON(fiber.Map{
			"error": "Goal is locked after approval",
		})
	}

	var body CreateGoalRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	goal.Title = body.Title
	goal.Description = body.Description
	goal.GoalType = body.GoalType
	goal.TargetValue = body.TargetValue
	goal.Weightage = body.Weightage

	database.DB.Save(&goal)

	return c.JSON(fiber.Map{
		"message": "Goal updated successfully",
		"goal":    goal,
	})
}
func UpdateProgress(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	var body UpdateProgressRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	goal.AchievedValue = body.AchievedValue
	goal.Status = body.Status

	// Progress Calculation
	switch goal.GoalType {

	case "NUMERIC_MAX":

		if goal.TargetValue > 0 {
			goal.Progress =
				(goal.AchievedValue / goal.TargetValue) * 100
		}

	case "NUMERIC_MIN":

		if goal.AchievedValue > 0 {
			goal.Progress =
				(goal.TargetValue / goal.AchievedValue) * 100
		}

	case "ZERO":

		if goal.AchievedValue == 0 {
			goal.Progress = 100
		} else {
			goal.Progress = 0
		}
	}

	// Cap progress at 100
	if goal.Progress > 100 {
		goal.Progress = 100
	}

	goal.Progress = math.Round(goal.Progress*100) / 100
	database.DB.Save(&goal)

	return c.JSON(fiber.Map{
		"message": "Progress updated successfully",
		"goal":    goal,
	})
}

func GetMyGoals(c *fiber.Ctx) error {
	userId := uint(c.Locals("userId").(float64))
	var goals []Goal
	database.DB.Where("employee_id = ?", userId).Find(&goals)
	return c.JSON(fiber.Map{"goals": goals})
}

func DeleteGoal(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	database.DB.Delete(&goal)

	return c.JSON(fiber.Map{
		"message": "Goal deleted successfully",
	})
}
