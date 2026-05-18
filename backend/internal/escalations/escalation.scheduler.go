package escalations

import (
	"log"

	"github.com/robfig/cron/v3"
)

func StartEscalationScheduler() {

	c := cron.New()

	c.AddFunc("@every 1m", func() {

		log.Println("Running escalation checks...")

		CheckGoalSubmissionEscalations()
	})

	c.Start()

	log.Println("Escalation scheduler started")
}
