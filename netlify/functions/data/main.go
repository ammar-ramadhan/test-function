package main

import (
	"database/sql"
	"encoding/json"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/go-sql-driver/mysql"
)

type Product struct {
	Id         int64  `json:"id"`
	Name       string `json:"name"`
	ImageUrl   string `json:"image"`
	CategoryId int64  `json:"category"`
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 503,
			Body:       "Failed to connect to db",
		}, nil
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 503,
			Body:       "Failed to ping db",
		}, nil
	}

	query := "SELECT * FROM products"
	res, err := db.Query(query)
	defer res.Close()
	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 503,
			Body:       "Failed to fetch from db",
		}, nil
	}

	products := []Product{}
	for res.Next() {
		var product Product
		err := res.Scan(&product.Id, &product.Name, &product.ImageUrl, &product.CategoryId)
		if err != nil {
			return &events.APIGatewayProxyResponse{
				StatusCode: 503,
				Body:       "Failed to scan from db",
			}, nil
		}
		products = append(products, product)
	}

	jsonData, err := json.Marshal(products)
	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 503,
			Body:       "Failed to encode to JSON",
		}, nil
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(jsonData),
	}, nil
}

func main() {
	lambda.Start(handler)
}
