package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-lambda-go/lambdacontext"
	_ "github.com/go-sql-driver/mysql"
)

type APIResponse struct {
	Counter int `json:"counter"`
}

type APIRequest struct {
	Counter int `json:"counter"`
}

type User struct {
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	lc, ok := lambdacontext.FromContext(ctx)

	if !ok {
		return &events.APIGatewayProxyResponse{
			StatusCode: 503,
			Body:       "Something went wrong :(",
		}, nil
	}

	cc := lc.ClientContext
	fmt.Printf("cc: %+v\n", cc)
	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "Hello, " + cc.Client.AppTitle,
	}, nil

	// db, err := sql.Open("mysql", os.Getenv("DSN"))
	// if err != nil {
	// 	return &events.APIGatewayProxyResponse{
	// 		StatusCode: 503,
	// 		Body:       "Failed to connect to db",
	// 	}, nil
	// }
	// defer db.Close()
	// if err := db.Ping(); err != nil {
	// 	return &events.APIGatewayProxyResponse{
	// 		StatusCode: 503,
	// 		Body:       "Failed to ping db",
	// 	}, nil
	// }

	// query := "SELECT * FROM products"
	// res, err := db.Query(query)
	// if err != nil {
	// 	return &events.APIGatewayProxyResponse{
	// 		StatusCode: 503,
	// 		Body:       "Failed to fetch from db",
	// 	}, nil
	// }
	// defer res.Close()

	// products := []Product{}
	// for res.Next() {
	// 	var product Product
	// 	err := res.Scan(&product.Id, &product.Name, &product.ImageUrl, &product.CategoryId)
	// 	if err != nil {
	// 		return &events.APIGatewayProxyResponse{
	// 			StatusCode: 503,
	// 			Body:       "Failed to scan from db",
	// 		}, nil
	// 	}
	// 	products = append(products, product)
	// }

	// jsonData, err := json.Marshal(products)
	// if err != nil {
	// 	return &events.APIGatewayProxyResponse{
	// 		StatusCode: 503,
	// 		Body:       "Failed to encode to JSON",
	// 	}, nil
	// }

	// return &events.APIGatewayProxyResponse{
	// 	StatusCode: 200,
	// 	Body:       string(jsonData),
	// }, nil
}

func main() {
	lambda.Start(handler)
}
