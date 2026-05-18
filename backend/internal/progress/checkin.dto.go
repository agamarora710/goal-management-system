package progress

type CreateCheckInRequest struct {
	Comment string `json:"comment"`
	Quarter string `json:"quarter"`
}
