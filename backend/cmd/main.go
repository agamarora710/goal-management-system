package main

import (
	"log"
	"os"

	"goal-management-system/internal/analytics"
	"goal-management-system/internal/audit"
	"goal-management-system/internal/auth"
	"goal-management-system/internal/database"
	"goal-management-system/internal/escalations"
	"goal-management-system/internal/goals"
	"goal-management-system/internal/middleware"
	"goal-management-system/internal/progress"
	"goal-management-system/internal/users"

	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/gofiber/fiber/v2"
)

func main() {

	// Connect Database
	database.ConnectDB()
	escalations.StartEscalationScheduler()
	log.Println("ConnectDB function called")

	// Auto Migrate Tables
	err := database.DB.AutoMigrate(
		&users.User{},
		&goals.Goal{},
		&escalations.Escalation{},
		&progress.CheckIn{},
		&progress.QuarterlyUpdate{},
		&audit.AuditLog{},
	)

	if err != nil {
		log.Fatal("Migration Failed")
	}

	app := fiber.New()
	app.Use(cors.New())

	// Test Route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Goal Management API Running")
	})

	app.Post("/register", auth.Register)
	app.Post("/login", auth.Login)

	app.Post(
		"/goals",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.CreateGoal,
	)

	app.Post(
		"/submit-goals",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.SubmitGoals,
	)

	app.Get("/protected", middleware.Protected(), func(c *fiber.Ctx) error {

		return c.JSON(fiber.Map{
			"message": "Protected route accessed",
			"userId":  c.Locals("userId"),
			"role":    c.Locals("role"),
		})
	})

	app.Get(
		"/manager/goals",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.GetSubmittedGoals,
	)

	app.Put(
		"/manager/goals/:id/approve",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.ApproveGoal,
	)

	app.Put(
		"/goals/:id",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.UpdateGoal,
	)

	app.Put(
		"/manager/goals/:id/reject",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.RejectGoal,
	)

	app.Put(
		"/manager/goals/:id/edit",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.UpdateGoalByManager,
	)

	app.Post(
		"/manager/shared-goal",
		middleware.Protected(),
		middleware.RoleMiddlewareMulti("manager", "admin"),
		goals.CreateSharedGoal,
	)
	app.Put(
		"/goals/:id/progress",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.UpdateProgress,
	)

	app.Post(
		"/manager/goals/:id/checkin",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		progress.AddCheckIn,
	)

	app.Post(
		"/goals/:id/quarterly-update",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		progress.CreateQuarterlyUpdate,
	)

	app.Put(
		"/admin/goals/:id/unlock",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		goals.UnlockGoal,
	)
	app.Get(
		"/manager/team-dashboard",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.GetTeamDashboard,
	)

	app.Get(
		"/manager/submitted-goals",
		middleware.Protected(),
		goals.GetSubmittedGoals,
	)

	app.Get(
		"/goals",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.GetMyGoals,
	)
	app.Get(
		"/manager/approved-goals",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.GetApprovedGoals,
	)

	app.Get(
		"/goals/quarterly-updates",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		progress.GetMyQuarterlyUpdates,
	)

	app.Get(
		"/manager/quarterly-updates",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		progress.GetTeamQuarterlyUpdates,
	)

	app.Put(
		"/manager/quarterly-updates/:id/comment",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		progress.AddManagerComment,
	)

	app.Delete(
		"/employee/goals/:id",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.DeleteGoal,
	)
	app.Get(
		"/admin/users",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		users.GetAllUsers,
	)

	app.Get(
		"/admin/goals",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		goals.GetAllGoalsAdmin,
	)

	app.Get(
		"/admin/audit-logs",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		audit.GetAuditLogs,
	)

	app.Get(
		"/manager/employees",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.GetDepartmentEmployees,
	)

	app.Put(
		"/goals/:id/shared-weightage",
		middleware.Protected(),
		middleware.RoleMiddleware("employee"),
		goals.UpdateSharedGoalWeightage,
	)
	app.Get(
		"/manager/employees",
		middleware.Protected(),
		middleware.RoleMiddleware("manager"),
		goals.GetDepartmentEmployees,
	)
	app.Get(
		"/admin/employees",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		goals.GetAllEmployees,
	)

	app.Get(
		"/admin/export",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		goals.ExportAchievementReport,
	)
	app.Get("/public/managers", auth.GetManagers)

	app.Get(
		"/admin/escalations",
		escalations.GetEscalations,
	)
	app.Get(
		"/manager/escalations",
		middleware.Protected(),
		escalations.GetManagerEscalations,
	)
	app.Get(
		"/admin/analytics/overview",
		middleware.Protected(),
		middleware.RoleMiddleware("admin"),
		analytics.GetAnalyticsOverview,
	)

	// Port
	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen(":" + port))

}
