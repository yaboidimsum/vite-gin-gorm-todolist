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