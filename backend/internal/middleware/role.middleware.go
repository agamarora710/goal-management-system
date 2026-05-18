package middleware

import "github.com/gofiber/fiber/v2"

func RoleMiddleware(allowedRoles ...string) fiber.Handler {

	return func(c *fiber.Ctx) error {

		role := c.Locals("role").(string)

		for _, allowedRole := range allowedRoles {

			if role == allowedRole {
				return c.Next()
			}
		}

		return c.Status(403).JSON(fiber.Map{
			"error": "Access denied",
		})
	}
}
func RoleMiddlewareMulti(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		role := c.Locals("role").(string)
		for _, r := range roles {
			if role == r {
				return c.Next()
			}
		}
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	}
}
