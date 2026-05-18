package goals

import (
	"fmt"
	"goal-management-system/internal/audit"
	"goal-management-system/internal/database"
	"goal-management-system/internal/users"

	"github.com/gofiber/fiber/v2"
)

func UnlockGoal(c *fiber.Ctx) error {

	id := c.Params("id")

	var goal Goal

	result := database.DB.First(&goal, id)

	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Goal not found",
		})
	}

	goal.Locked = false

	database.DB.Save(&goal)

	adminId := uint(c.Locals("userId").(float64))

	audit.CreateAuditLog(
		adminId,
		"UNLOCKED_GOAL",
		"goal",
		goal.ID,
	)

	return c.JSON(fiber.Map{
		"message": "Goal unlocked successfully",
		"goal":    goal,
	})
}

func GetAllGoalsAdmin(c *fiber.Ctx) error {
	type AdminGoal struct {
		ID           uint    `json:"id"`
		Title        string  `json:"title"`
		Weightage    float64 `json:"weightage"`
		Status       string  `json:"status"`
		Approved     bool    `json:"approved"`
		Submitted    bool    `json:"submitted"`
		Locked       bool    `json:"locked"`
		Progress     float64 `json:"progress"`
		EmployeeName string  `json:"employeeName"`
		Department   string  `json:"department"`
	}

	var goals []AdminGoal

	database.DB.Raw(`
        SELECT
            goals.id,
            goals.title,
            goals.weightage,
            goals.status,
            goals.approved,
            goals.submitted,
            goals.locked,
            goals.progress,
            users.name as employee_name,
            users.department as department
        FROM goals
        JOIN users ON users.id = goals.employee_id
    `).Scan(&goals)

	return c.JSON(fiber.Map{"goals": goals})
}
func GetAllEmployees(c *fiber.Ctx) error {
	var employees []users.User
	database.DB.Where("role = ?", "employee").Find(&employees)
	return c.JSON(fiber.Map{"employees": employees})
}
func ExportAchievementReport(c *fiber.Ctx) error {
	type ReportRow struct {
		EmployeeName  string
		Department    string
		GoalTitle     string
		GoalType      string
		TargetValue   float64
		AchievedValue float64
		Progress      float64
		Weightage     float64
		Status        string
	}

	var rows []ReportRow

	database.DB.Raw(`
        SELECT
            users.name as employee_name,
            users.department as department,
            goals.title as goal_title,
            goals.goal_type as goal_type,
            goals.target_value as target_value,
            goals.achieved_value as achieved_value,
            goals.progress as progress,
            goals.weightage as weightage,
            goals.status as status
        FROM goals
        JOIN users ON users.id = goals.employee_id
        WHERE goals.approved = true
        ORDER BY users.department, users.name
    `).Scan(&rows)

	// Build CSV
	c.Set("Content-Type", "text/csv")
	c.Set("Content-Disposition", "attachment; filename=achievement_report.csv")

	csv := "Employee,Department,Goal,Type,Target,Achieved,Progress,Weightage,Status\n"
	for _, row := range rows {
		csv += fmt.Sprintf("%s,%s,%s,%s,%.2f,%.2f,%.2f%%,%.2f%%,%s\n",
			row.EmployeeName,
			row.Department,
			row.GoalTitle,
			row.GoalType,
			row.TargetValue,
			row.AchievedValue,
			row.Progress,
			row.Weightage,
			row.Status,
		)
	}

	return c.SendString(csv)
}
