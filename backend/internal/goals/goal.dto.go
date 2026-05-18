package goals

type CreateSharedGoalRequest struct {
	Title          string  `json:"title"`
	Description    string  `json:"description"`
	GoalType       string  `json:"goalType"`
	TargetValue    float64 `json:"targetValue"`
	EmployeeIDs    []uint  `json:"employeeIds"`
	PrimaryOwnerID uint    `json:"primaryOwnerId"`
}

type CreateGoalRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	GoalType    string  `json:"goalType"`
	TargetValue float64 `json:"targetValue"`
	Weightage   float64 `json:"weightage"`
}

type UpdateProgressRequest struct {
	AchievedValue float64 `json:"achievedValue"`
	Status        string  `json:"status"`
}
