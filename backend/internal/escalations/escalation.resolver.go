package escalations

import "goal-management-system/internal/database"

func ResolveGoalSubmissionEscalations(
	userID uint,
) {

	database.DB.
		Model(&Escalation{}).
		Where(
			"user_id = ? AND type = ? AND status = ?",
			userID,
			GoalNotSubmitted,
			"open",
		).
		Update("status", "resolved")
}
