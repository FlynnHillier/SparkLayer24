package db

type Todo struct {
	Title       string
	Description string 
}

var TODOS = []Todo{
	{
		Title: "Test",
		Description: "Test TODO",
	},
}
