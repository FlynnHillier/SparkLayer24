import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Todo, { TodoType } from "./Todo";
import { SERVER_ADDRESS } from "./constants";

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [addTodoRequestIsPending, setAddTodoRequestIsPending] = useState<boolean>(false);

  // I typically avoid using useState when working with objects - I would typically opt to use the 'useReducer' hook instead.
  // However, due to the simplicity of the problem - in this scenario I think useState is ok.
  const [pendingTodo, setPendingTodo] = useState<TodoType>({ title: "", description: "" });

  // Initially fetch todo
  // Typically I'd use react-query here - but seeing as you've already implemented this I will assume, in this scenario, a simple useEffect implemenation is ok.
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch(`${SERVER_ADDRESS}/`);
        if (todos.status !== 200) {
          console.log("Error fetching data");
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log("Could not connect to server. Ensure it is running. " + e);
      }
    };

    fetchTodos();
  }, []);

  //Initiate request to server to add ToDo
  const requestAddToDo = useCallback(
    async (todo: TodoType) => {
      setAddTodoRequestIsPending(true);

      try {
        const res = await fetch(`${SERVER_ADDRESS}/`, {
          method: "POST",
          body: JSON.stringify(todo),
        });

        if (!res.ok) {
          // Typically we'd add better error handling here - however doing so would likely be overengineering for this project?
          throw Error(`Unexpected response status '${res.status}' when requesting to add TODO`);
        }

        const responseBody = await res.json();

        setTodos((prev) => [...prev, responseBody]);
        clearPendingTodo();
      } catch (e) {
        console.log("Error requesting addition of TODO", e);
      } finally {
        setAddTodoRequestIsPending(false);
      }
    },
    [setTodos, setAddTodoRequestIsPending]
  );

  // Update the state of the pendingTodo
  const updatePendingTodo = useCallback(
    (toUpdate: Partial<TodoType>) => {
      setPendingTodo((prev) => ({ ...prev, ...toUpdate }));
    },
    [setPendingTodo]
  );

  // Clear the state of the pending todo (revert to empty)
  const clearPendingTodo = useCallback(() => {
    setPendingTodo({ title: "", description: "" });
  }, [setPendingTodo]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) => (
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        ))}
      </div>

      <h2>Add a Todo</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (pendingTodo) requestAddToDo(pendingTodo);
        }}
      >
        <input
          placeholder="Title"
          name="title"
          autoFocus={true}
          type="text"
          onInput={(e) => {
            updatePendingTodo({ title: (e.target as HTMLInputElement).value });
          }}
          value={pendingTodo.title}
        />
        <input
          placeholder="Description"
          name="description"
          type="text"
          onInput={(e) => {
            updatePendingTodo({ description: (e.target as HTMLInputElement).value });
          }}
          value={pendingTodo.description}
        />
        <button
          type="submit"
          disabled={
            addTodoRequestIsPending ||
            !(pendingTodo?.description.length && pendingTodo.title.length)
          }
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}

export default App;
