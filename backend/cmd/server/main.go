package main

import (
	"log"

	"okusuri-backend/internal"
	"okusuri-backend/migrations"
	"okusuri-backend/pkg/config"
)

func main() {
	config.SetupDB()
	migrations.RunMigrations(config.GetDB())

	e := internal.SetupRoutes()
	if err := e.Start(":8080"); err != nil {
		log.Fatalf("サーバーの起動に失敗しました: %v", err)
	}
}
