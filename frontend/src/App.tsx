import React, {
  Dispatch,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import Todo, { TodoType } from "./Todo";
import { SERVER_ADDRESS } from "./constants";

const AddTodoForm = forwardRef(
  (
    { setTodoList }: { setTodoList: Dispatch<React.SetStateAction<TodoType[]>> },
    ref: ForwardedRef<HTMLFormElement>
  ) => {
    const [pendingTodo, setPendingTodo] = useState<TodoType>({ title: "", description: "" });
    const [isAddTodoRequestPending, setIsAddTodoRequestPending] = useState<boolean>(false);

    //Initiate request to server to add ToDo
    const requestAddToDo = useCallback(
      async (todo: TodoType) => {
        setIsAddTodoRequestPending(true);

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

          setTodoList((prev) => [...prev, responseBody]);
          clearPendingTodo();
        } catch (e) {
          console.log("Error requesting addition of TODO", e);
        } finally {
          setIsAddTodoRequestPending(false);
        }
      },
      [setTodoList, setIsAddTodoRequestPending]
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
      <form
        ref={ref}
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
            isAddTodoRequestPending ||
            !(pendingTodo?.description.length && pendingTodo.title.length)
          }
        >
          Add Todo
        </button>
      </form>
    );
  }
);

function App() {
  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [todoList]);

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

        setTodoList(await todos.json());
      } catch (e) {
        console.log("Could not connect to server. Ensure it is running. " + e);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todoList.map((todo) => (
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        ))}
      </div>

      <h2>Add a Todo</h2>
      <AddTodoForm setTodoList={setTodoList} ref={formRef} />
    </div>
  );
}

export default App;
