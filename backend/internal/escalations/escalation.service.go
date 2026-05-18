package escalations

import (
	"goal-management-system/internal/database"
)

func CreateEscalation(
	userID uint,
	goalSheetID uint,
	escalationType string,
	message string,
	escalatedTo uint,
	level int,
) error {

	escalation := Escalation{
		UserID:          userID,
		GoalSheetID:     goalSheetID,
		Type:            escalationType,
		Message:         message,
		Status:          "open",
		EscalatedTo:     escalatedTo,
		EscalationLevel: level,
	}

	return database.DB.Create(&escalation).Error
}
