package routes

import (
	"gin-todo-app/controllers"
	"time"

	"github.com/gin-contrib/cors" // 1. Import ini
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	// r -> router
	r := gin.Default()

	// CORS is solved saat berada di modul route, karena menetapkan aturannya terlebih dahulu sebelum jalan
	r.Use(cors.New(
		cors.Config{
			AllowOrigins: []string{"http://localhost:5173"},
			AllowMethods: []string{"GET","POST","PUT","PATCH","DELETE","HEAD"},
			AllowHeaders: []string{"Origin","Content-Type","Authorization"},
			ExposeHeaders: []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge: 12*time.Hour,
		}))


	// Versioning route with version 1st variable
	v1 := r.Group("v1/")
	{
		v1.GET("todo", controllers.GetAllTodos)
		v1.POST("todo", controllers.CreateATodo)
		v1.GET("todo/:id", controllers.GetATodo)
		v1.PUT("todo/:id", controllers.UpdateATodo)
		v1.DELETE("todo/:id", controllers.DeleteATodo)
	}
	return r
}