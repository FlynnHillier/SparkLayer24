package db

type Todo struct {
	Title       string 	`json:"title"`
	Description string  `json:"description"`
}

var TODOS = []Todo{
	{
		Title: "Test",
		Description: "Test TODO",
	},
}
