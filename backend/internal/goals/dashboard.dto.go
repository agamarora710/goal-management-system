package goals

type TeamDashboardResponse struct {
	EmployeeName string `json:"employeeName"`
	Department   string `json:"department"`

	GoalTitle string `json:"goalTitle"`

	Quarter string `json:"quarter"`

	PlannedValue float64 `json:"plannedValue"`
	ActualValue  float64 `json:"actualValue"`

	Progress float64 `json:"progress"`

	Status    string  `json:"status"`
	Weightage float64 `json:"weightage"`
	ID        uint    `json:"id"`
}
