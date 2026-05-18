package escalations

import (
	"errors"
	"time"

	"goal-management-system/internal/database"
	"goal-management-system/internal/goals"
	"goal-management-system/internal/users"

	"gorm.io/gorm"
)

func CheckGoalSubmissionEscalations() {

	var employees []users.User

	database.DB.
		Where("role = ?", "employee").
		Find(&employees)

	for _, employee := range employees {

		// Ignore employees without manager
		if employee.ManagerID == 0 {
			continue
		}

		// Grace period for new employees
		daysSinceCreation :=
			time.Since(employee.CreatedAt).Hours() / 24

		if daysSinceCreation < 3 {
			continue
		}

		// Check if employee has ANY goals
		var totalGoals int64

		database.DB.
			Model(&goals.Goal{}).
			Where(
				"employee_id = ?",
				employee.ID,
			).
			Count(&totalGoals)

		// No goals created yet
		if totalGoals == 0 {
			continue
		}

		// Check submitted goals
		var draftGoalsCount int64

		database.DB.
			Model(&goals.Goal{}).
			Where(
				"employee_id = ? AND submitted = ?",
				employee.ID,
				false,
			).
			Count(&draftGoalsCount)

		// All goals submitted
		if draftGoalsCount == 0 {

			ResolveGoalSubmissionEscalations(
				employee.ID,
			)

			continue
		}

		// Check existing escalation
		var existingEscalation Escalation

		err := database.DB.
			Where(
				"user_id = ? AND type = ? AND status = ?",
				employee.ID,
				GoalNotSubmitted,
				"open",
			).
			First(&existingEscalation).Error

		// Escalation already exists
		if err == nil {
			continue
		}

		// Unexpected DB error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			continue
		}

		// Create escalation
		CreateEscalation(
			employee.ID,
			0,
			GoalNotSubmitted,
			"Goals created but not submitted",
			employee.ManagerID,
			1,
		)
	}
}
