import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }
        const todos = await res.json();
        console.log("Fetched Todos:", todos); // Debug log
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
        // You can log the error without displaying a message in the UI
      }
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.trim().length > 3) {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to create todo");
        }
        const newTodo = await res.json();
        console.log("New Todo Created:", newTodo); // Debug log

        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setContent("");  // Clear input field
      } catch (error) {
        console.error("Error creating todo:", error);
        // You can log the error without displaying a message in the UI
      }
    }
  };

  return (
    <main className="container">
      <h1 className="title">Todo List</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button className="form__button" type="submit">
          Create Todo
        </button>
      </form>

      <div className="todos">
        {todos.map((todo) => (
          <Todo key={todo._id} todo={todo} setTodos={setTodos} />
        ))}
      </div>
    </main>
  );
}
