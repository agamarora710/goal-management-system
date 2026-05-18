package audit

import (
	"goal-management-system/internal/database"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateAuditLog(
	userID uint,
	action string,
	entity string,
	entityID uint,
) {

	log := AuditLog{
		UserID:   userID,
		Action:   action,
		Entity:   entity,
		EntityID: entityID,
	}

	database.DB.Create(&log)
}

func GetAuditLogs(c *fiber.Ctx) error {
	type AuditWithUser struct {
		ID        uint      `json:"id"`
		Action    string    `json:"action"`
		Entity    string    `json:"entity"`
		EntityID  uint      `json:"entityId"`
		UserName  string    `json:"userName"`
		CreatedAt time.Time `json:"createdAt"`
	}

	var logs []AuditWithUser

	database.DB.Raw(`
        SELECT
            audit_logs.id,
            audit_logs.action,
            audit_logs.entity,
            audit_logs.entity_id,
            users.name as user_name,
            audit_logs.created_at
        FROM audit_logs
        JOIN users ON users.id = audit_logs.user_id
        ORDER BY audit_logs.created_at DESC
    `).Scan(&logs)

	return c.JSON(fiber.Map{"logs": logs})
}
