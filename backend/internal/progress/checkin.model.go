package progress

type CheckIn struct {
	ID        uint `gorm:"primaryKey"`
	GoalID    uint
	ManagerID uint
	Comment   string
	Quarter   string
}
