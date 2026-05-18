package escalations

import "time"

type Escalation struct {
	ID              uint `gorm:"primaryKey"`
	UserID          uint
	GoalSheetID     uint
	Type            string
	Message         string
	Status          string
	EscalatedTo     uint
	EscalationLevel int
	CreatedAt       time.Time
}
