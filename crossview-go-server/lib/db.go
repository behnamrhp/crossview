package lib

import (
	"fmt"
	"strings"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	*gorm.DB
}

func NewDatabase(env Env, logger Logger) Database {
	if env.AuthMode == "header" || env.AuthMode == "none" || !env.DBEnabled {
		logger.Info("Skipping database connection (auth mode is " + env.AuthMode + ")")
		return Database{DB: nil}
	}
	sslMode := env.DBSSLMode
	if sslMode == "" {
		sslMode = "disable"
	}
	dsnParts := []string{
		fmt.Sprintf("host=%s", env.DBHost),
		fmt.Sprintf("user=%s", env.DBUsername),
		fmt.Sprintf("password=%s", env.DBPassword),
		fmt.Sprintf("dbname=%s", env.DBName),
		fmt.Sprintf("port=%s", env.DBPort),
		fmt.Sprintf("sslmode=%s", sslMode),
		"TimeZone=UTC",
	}
	if env.DBSSLRootCert != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("sslrootcert=%s", env.DBSSLRootCert))
	}
	if env.DBSSLCert != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("sslcert=%s", env.DBSSLCert))
	}
	if env.DBSSLKey != "" {
		dsnParts = append(dsnParts, fmt.Sprintf("sslkey=%s", env.DBSSLKey))
	}

	dsn := strings.Join(dsnParts, " ")
	var db *gorm.DB
	var err error
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.GetGormLogger(),
		})
		if err == nil {
			break
		}
		if i < maxRetries-1 {
			logger.Infof("Database connection attempt %d/%d failed, retrying in 2 seconds...", i+1, maxRetries)
			time.Sleep(2 * time.Second)
		}
	}

	if err != nil {
		logger.Infof("Database connection failed: host=%s port=%s dbname=%s sslmode=%s", env.DBHost, env.DBPort, env.DBName, sslMode)
		logger.Panic(err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		logger.Panic(err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	logger.Info("Database connection established")

	return Database{
		DB: db,
	}
}

func (d Database) Close() error {
	if d.DB == nil {
		return nil
	}
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
