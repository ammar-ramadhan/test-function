package main

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type APIResponse struct {
	Counter int `json:"counter"`
}

type APIRequest struct {
	Counter int `json:"counter"`
}

func handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	var queries APIRequest
	err := json.Unmarshal([]byte(request.Body), &queries)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return &events.APIGatewayProxyResponse{
			StatusCode: 400,
		}, nil
	}

	jsonData, err := json.Marshal(&APIResponse{Counter: queries.Counter + 1})
	if err != nil {
		fmt.Println(err.Error())
		return &events.APIGatewayProxyResponse{
			StatusCode: 503,
			Body:       "error.server",
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
