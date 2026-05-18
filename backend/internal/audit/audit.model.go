package audit

import "time"

type AuditLog struct {
	ID uint `gorm:"primaryKey"`

	UserID uint
	Action string

	Entity   string
	EntityID uint

	CreatedAt time.Time
}
