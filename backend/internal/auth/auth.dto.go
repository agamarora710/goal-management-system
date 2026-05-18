package auth

type RegisterRequest struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Role       string `json:"role"`
	Department string `json:"department"`
	ManagerID  uint   `json:"managerId"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
