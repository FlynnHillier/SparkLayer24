package main

import (
	"log"
	"net/http"

	"github.com/flynnhillier/SparkLayer24/handlers"
	"github.com/flynnhillier/SparkLayer24/utils"
)

// Sources
// https://www.digitalocean.com/community/tutorials/how-to-make-an-http-server-in-go
// https://www.informit.com/articles/article.aspx?p=2861456&seqNum=6


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

	
	switch r.Method {
	case "":
		handlers.AddTodo(w,r)
	case "POST":
		handlers.Summary(w,r)
	default:
		w.WriteHeader(http.StatusNotImplemented)
	}
}
