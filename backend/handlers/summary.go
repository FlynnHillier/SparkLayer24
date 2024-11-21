package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/flynnhillier/SparkLayer24/db"
)

type SummaryResponsePayload struct {
	Data []db.Todo `json:"data"`
}

func Summary(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("status", "200")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(SummaryResponsePayload{db.TODOS})
}