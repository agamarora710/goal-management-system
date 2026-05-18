package analytics

import (
	"goal-management-system/internal/database"
	"goal-management-system/internal/goals"

	"github.com/gofiber/fiber/v2"
)

func GetAnalyticsOverview(c *fiber.Ctx) error {

	var totalGoals int64
	var approvedGoals int64
	var pendingGoals int64
	var rejectedGoals int64

	database.DB.Model(&goals.Goal{}).Count(&totalGoals)

	database.DB.
		Model(&goals.Goal{}).
		Where("approved = ?", true).
		Count(&approvedGoals)

	database.DB.
		Model(&goals.Goal{}).
		Where("submitted = ? AND approved = ?", true, false).
		Count(&pendingGoals)

	database.DB.
		Model(&goals.Goal{}).
		Where("status = ?", "rejected").
		Count(&rejectedGoals)

	return c.JSON(fiber.Map{
		"total_goals":    totalGoals,
		"approved_goals": approvedGoals,
		"pending_goals":  pendingGoals,
		"rejected_goals": rejectedGoals,
	})
}
