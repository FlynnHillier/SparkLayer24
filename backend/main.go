package main

import (
	"log"
	"net/http"

	"github.com/flynnhillier/SparkLayer24/utils"
)

// Sources
// https://www.digitalocean.com/community/tutorials/how-to-make-an-http-server-in-go


func main() {
	var PORT = utils.GetEnv("PORT")

	http.HandleFunc("/",ToDoListHandler)


	log.Default().Printf("Start HTTP server on port %s...",PORT)
	err := http.ListenAndServe(":" + PORT, nil)

	if(err != nil) {
		log.Fatalf("Fatal error starting server on port '%s' :\n%s",PORT, err.Error())
	}
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	log.Default().Print("Received request.")
}
