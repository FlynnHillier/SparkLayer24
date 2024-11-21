package main

import (
	"fmt"
	"net/http"

	"github.com/flynnhillier/SparkLayer24/utils"
)

// Sources
// https://www.digitalocean.com/community/tutorials/how-to-make-an-http-server-in-go


func main() {
	// Your code here

	fmt.Println(utils.GetEnv("hi"))
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
}
