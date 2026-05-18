package users

import "time"

type User struct {
	ID         uint `gorm:"primaryKey"`
	Name       string
	Email      string `gorm:"unique"`
	Password   string
	Role       string
	ManagerID  uint
	Department string
	CreatedAt  time.Time
}
