package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/flynnhillier/SparkLayer24/db"
)

func AddTodo(w http.ResponseWriter, r *http.Request) {
	var TodoForInsert db.Todo;
	parseErr := json.NewDecoder(r.Body).Decode(&TodoForInsert)
	
	if(parseErr != nil) {
		// Invalid request payload
		w.Header().Set("status","400")
		return
	}

	// Insert into our TODO 'database'
	db.TODOS = append(db.TODOS, TodoForInsert)

	// Successfully added TODO
	w.Header().Set("status", "200")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(TodoForInsert)
}