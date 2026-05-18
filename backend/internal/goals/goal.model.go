package goals

type Goal struct {
	ID             uint `gorm:"primaryKey"`
	EmployeeID     uint
	Title          string
	Description    string
	GoalType       string
	TargetValue    float64
	AchievedValue  float64
	Weightage      float64
	Status         string
	Approved       bool
	Submitted      bool
	Locked         bool
	Shared         bool
	SharedGoalID   uint
	PrimaryOwnerID uint
	Progress       float64
}
