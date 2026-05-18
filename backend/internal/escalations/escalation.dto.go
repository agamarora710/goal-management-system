package escalations

type EscalationResponse struct {
	ID              uint
	UserName        string
	Type            string
	Message         string
	Status          string
	EscalatedToName string
	EscalationLevel int
	CreatedAt       string
}
