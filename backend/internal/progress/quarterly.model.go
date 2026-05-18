package progress

type QuarterlyUpdate struct {
	ID uint `gorm:"primaryKey"`

	GoalID  uint
	Quarter string

	PlannedValue float64
	ActualValue  float64

	Progress float64
	Status   string

	ManagerComment string
}
