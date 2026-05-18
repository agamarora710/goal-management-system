package progress

type CreateQuarterlyUpdateRequest struct {
	Quarter      string  `json:"quarter"`
	PlannedValue float64 `json:"plannedValue"`
	ActualValue  float64 `json:"actualValue"`
	Status       string  `json:"status"`
}
