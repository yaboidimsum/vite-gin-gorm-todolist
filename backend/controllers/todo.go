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