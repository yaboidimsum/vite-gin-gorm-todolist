# Vite + Gin + Gorm + MySQL TODO List

## Introduction

As a person who enjoys frontend stuff like ui/ux and design engineering, backend stuff looks scary to me, but I'm gonna put an end to that fear today by creating a todo list using Vite for the frontend and GIN GORM for my backend, so now I can become a fullstack design engineer(jk still a long way to go lol) 🔥

## Initiate a New Project

For the new project structure, it'll look like this: separate the backend and frontend for more robust architecture

```text
gin-todo-app/
├── .gitignore               # Git ignore rules for both Go and Node
├── README.md                # Project documentation
├── backend/                 # 🐘 Golang Backend (API)
└── frontend/                # ⚛️ React Frontend (Vite)
```

## Backend

Aight so for the backend i'll be using GIN (Web Framework), GORM (ORM Library for working with databases), MySQL (Database) for simplicity

```text
├── backend/                 # 🐘 Golang Backend (API)
│   ├── config/
│   │   └── database.go      # Database connection & GORM setup
│   ├── controllers/
│   │   └── todo.go          # HTTP Handlers (Business Logic)
│   ├── models/
│   │   └── model.go         # Database Structs & Schema definitions
│   │   └── todos.go         # Query operations occure
│   ├── routes/
│   │   └── routes.go        # Router setup & CORS Middleware configuration
│   ├── go.mod               # Go Module definition
│   ├── go.sum               # Go dependencies checksums
│   └── main.go              # Entry point (Server initialization)
```

### Config

Config only contain 1 file and it's the `database.go`

```go
package config

import(
	"fmt"
	"github.com/jinzhu/gorm"
)

type DBConfig struct {
	Host string
	Port int
	User string
	DBName string
	Password string
}

// Singleton db connection to be accessible to all file
var DB *gorm.DB

func BuildDBConfig() *DBConfig {
	dbConfig := DBConfig{
		Host: "0.0.0.0",
		Port: 3306,
		User: "root",
		DBName: "todos",
		Password: "mypassword",
	}
	return &dbConfig
}

func DbUrl(dbConfig *DBConfig) string {

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
		dbConfig.User,
		dbConfig.Password,
		dbConfig.Host,
		dbConfig.Port,
		dbConfig.DBName,
	)
}
```

First the database struct type needs to be specified, port use `int` while the rest value are `string`

```go
type DBConfig struct {
	Host string
	Port int
	User string
	DBName string
	Password string
}
```

Implement a singleton pattern for `var DB` using a pointer to `gorm.db`. It is useful if other files, such as the queries in `models/todos.go` need to access the database

```go
var DB *gorm.DB
```

Set your own database config based on your local environment. These two functions are important for DB Connection in `main.go`

```go
func BuildDBConfig() *DBConfig {
	dbConfig := DBConfig{
		Host: "0.0.0.0",
		Port: 3306,
		User: "root",
		DBName: "todos",
		Password: "mypassword",
	}
	return &dbConfig
}

func DbUrl(dbConfig *DBConfig) string {

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
		dbConfig.User,
		dbConfig.Password,
		dbConfig.Host,
		dbConfig.Port,
		dbConfig.DBName,
	)
}
```

### Models

The models directory contains `model.go` and `todos.go`. `model.go` is where the database structs & schema definitions, for a larger project there would be a lot of schema but for the sake of simplicity in todo app, there's only one. `todos.go` is where the queries happen using GORM from the `config/database.go`. I'll explain the detail below

First there is `model.go`, it contains a struct and a method. The struct contains the table schema with JSON tags for the frontend and a method that follows the GORM conventions for naming (in this case it's `TableName()` to change the table name from GORM default). When the Todo struct is instantiated using `&models.Todo{}` for migrate, the method `TableName()` is also executed to name the table.

```go
package models

type Todo struct {
	ID uint `json:"id"`
	Title string `json:"title"`
	Description string `json:"description"`
}

func (t *Todo) TableName() string {
	return "todo"
}
```

Next there is `todos.go`, it contains all the queries for our todo app. It uses the config import to get the `config.DB`, so it enables us to use the GORM query. Meanwhile for `_ "github.com/go-sql-driver/mysql"` it acts only as initialization of MySQL driver via side effects, so our app can communicate with the MySQL database (we don't need to call any func from the import)

```go
package models

import (
	"fmt"
	"gin-todo-app/config"

	_ "github.com/go-sql-driver/mysql"
)

// fetch all todos

func GetAllTodos(todo *[]Todo) (err error){
	err = config.DB.Find(todo).Error;

	if err != nil {
		return err
	}

	return nil
}

func CreateATodo(todo *Todo) (err error){
	err = config.DB.Create(todo).Error;
	if err != nil {
		return err
	}
	return nil
}

func GetATodo(todo *Todo, id string) (err error){
	err = config.DB.Where("id = ?", id).First(todo).Error;
	if err != nil {
		return err
	}
	return nil
}

func UpdateATodo(todo *Todo, id string) (err error){
	fmt.Println(todo)
	config.DB.Save(todo)
	return nil
}

func DeleteATodo(todo *Todo, id string) (err error){
	config.DB.Where("id = ?", id).Delete(todo)
	fmt.Printf("Deleted %s", id)
	return nil
}
```

These two functions look similiar,`GetAllTodos` get all list of todo (`todo *[]Todo`) in the database, while `CreateATodo` makes a new todo (`todo *Todo`) into the db. This may look confusing but in `err =` the query does happen and fill it to the pointer todo, the `err` value only takes the error message during the query and return the err

```go
func GetAllTodos(todo *[]Todo) (err error){
	err = config.DB.Find(todo).Error;

	if err != nil {
		return err
	}

	return nil
}

func CreateATodo(todo *Todo) (err error){
	err = config.DB.Create(todo).Error;
	if err != nil {
		return err
	}
	return nil
}
```

Now these 3 functions look different because they have an id parameter that targets a specific todo id. `GetATodo` & `DeleteATodo` use `Where` query, while `UpdateATodo` directly saves the updated todo entry.

```go
func GetATodo(todo *Todo, id string) (err error){
	err = config.DB.Where("id = ?", id).First(todo).Error;
	if err != nil {
		return err
	}
	return nil
}

func UpdateATodo(todo *Todo, id string) (err error){
	fmt.Println(todo)
	config.DB.Save(todo)
	return nil
}

func DeleteATodo(todo *Todo, id string) (err error){
	config.DB.Where("id = ?", id).Delete(todo)
	fmt.Printf("Deleted %s", id)
	return nil
}
```

### Controllers

The Controllers directory contains `todo.go` that works as HTTP Handlers by using the `models/todos.go` queries. The pattern looks similiar to `models/todos.go` but controllers use gin context to handle http requests, I'll explain more down below

```go
package controllers

import (
	"gin-todo-app/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// So here we're passing the empty todo using pointer to be updated by the model method
func GetAllTodos(c *gin.Context){
	var todo []models.Todo;

	err := models.GetAllTodos(&todo);

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}
	c.JSON(http.StatusOK,todo)
}

func CreateATodo(c *gin.Context){
	var todo models.Todo;
	// Reason why create and update needs to be update to bindjson karena mereka updating the DB, not reading like others
	// Matching the readable Go rule with its corresponding json in the model structure
	/*
	1. Membaca Body Request (paket) yang dikirim user.
    2. Mencocokkan Key JSON ("title") dengan Struct Tag (json:"title").
    3. Mengisi variabel var todo models.Todo yang masih kosong dengan data dari JSON tersebut.
	*/
	c.BindJSON(&todo)
	err:= models.CreateATodo(&todo);

	if err != nil{
		c.AbortWithStatus(http.StatusNotFound)
	}
	c.JSON(http.StatusOK, todo)
}

func GetATodo(c *gin.Context){
	id := c.Params.ByName("id");
	var todo models.Todo;

	err:= models.GetATodo(&todo, id)

	if err != nil{
		c.AbortWithStatus(http.StatusNotFound)
	}
	c.JSON(http.StatusOK, todo)
}

func UpdateATodo(c *gin.Context){
	id := c.Params.ByName("id");
	var todo models.Todo;

	err:=models.GetATodo(&todo,id)

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}

	c.BindJSON(&todo)
	err=models.UpdateATodo(&todo,id)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}
	c.JSON(http.StatusOK, todo)

}


func DeleteATodo(c *gin.Context){
	id := c.Params.ByName("id");
	var todo models.Todo;

	err:=models.GetATodo(&todo,id)

	if err != nil {
		c.AbortWithStatus(http.StatusNotFound);
	}

	err = models.DeleteATodo(&todo, id)

	if err != nil{
		c.AbortWithStatus(http.StatusNotFound)
	}
	c.JSON(http.StatusOK,todo)
}
```

So remember when i said, it looks similiar with the queries in `models/todos.go`? The only different is that the use context from `*gin.Context`

```go
// If the error occures from the query, use AbortWithStatus
c.AbortWithStatus(http.StatusNotFound)

// BindJSON to create or update into the database
c.BindJSON(&todo)

// use context to get the id from the params
id := c.Params.ByName("id");

// send 200 response with todo data in json format
c.JSON(http.StatusOK,todo)
```

### Routes

The routes directory contains `routes.go` and the route uses the Gin framework. It also only has one func called `SetupRouter()` that configures and returns the `*gin.Engine`.

```go
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
```

First we set up the route by using the gin default (it includes middleware, but for other configurations, refer to the official Gin docs)

```go
	r := gin.Default()
```

And then set the cors.Config to allow the frontend (one origin) to request resources from the backend (a different origin). Set the config as follows, or adjust it depending on your environment settings.

```go
	r.Use(cors.New(
		cors.Config{
			AllowOrigins: []string{"http://localhost:5173"},
			AllowMethods: []string{"GET","POST","PUT","PATCH","DELETE","HEAD"},
			AllowHeaders: []string{"Origin","Content-Type","Authorization"},
			ExposeHeaders: []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge: 12*time.Hour,
		}))

```

Create a versioning group (example here v1) and v1 contains http method such as `GET,POST,PUT,DELETE` that will be paired with the end point, any required IDs, and controller's http handlers

```go
v1 := r.Group("v1/")
	{
		v1.GET("todo", controllers.GetAllTodos)
		v1.POST("todo", controllers.CreateATodo)
		v1.GET("todo/:id", controllers.GetATodo)
		v1.PUT("todo/:id", controllers.UpdateATodo)
		v1.DELETE("todo/:id", controllers.DeleteATodo)
	}
```

## Frontend
