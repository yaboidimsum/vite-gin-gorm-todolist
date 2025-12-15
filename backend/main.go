package main

import (
	"fmt"
	"gin-todo-app/config"
	"gin-todo-app/models"
	"gin-todo-app/routes"
	"github.com/jinzhu/gorm"
)

var err error;

func main() {
	// Create a DB Connection
	config.DB,err = gorm.Open("mysql", config.DbUrl(config.BuildDBConfig()))

	if err != nil {
		fmt.Println("Status:", err)
	}

	// this line means all of main functionality needs to be finish first before the db is close
	defer config.DB.Close()

	// Run migrations
	config.DB.AutoMigrate(&models.Todo{})

	// setup routes;

	r := routes.SetupRouter()

	// running
	r.Run(":3000")
}