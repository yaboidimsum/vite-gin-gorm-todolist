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

