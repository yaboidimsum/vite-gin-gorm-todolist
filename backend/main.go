package main

import (
	"fmt"
	"gin-todo-app/config"
	"gin-todo-app/models"
	"gin-todo-app/routes"

	// "time"

	// "github.com/gin-contrib/cors"
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
	// r.Use(cors.New(
	// 	cors.Config{
	// 		AllowOrigins: []string{"http://localhost:5173"},
	// 		AllowMethods: []string{"GET","POST","PUT","PATCH","DELETE","HEAD"},
	// 		AllowHeaders: []string{"Origin","Content-Type","Authorization"},
	// 		ExposeHeaders: []string{"Content-Length"},
	// 		AllowCredentials: true,
	// 		MaxAge: 12*time.Hour,
	// 	}))

	// running
	r.Run(":3000")
}