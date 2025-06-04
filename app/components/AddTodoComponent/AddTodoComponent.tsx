import { useContext } from "react";
import { TodosContext } from "~/contexts/TodosContext";

export default function AddTodoComponent() {

  const {
    setSessionTodos,
    updateTodos,
    updateTodosWithSession,
    addTodo,
    todos
  } = useContext(TodosContext);

  const handleSubmit = (formData: FormData) => {
    const title = `${formData.get("title")}`;
    const description = `${formData.get("description")}`;
    
    if(title.length > 0 && description.length > 0){
      const newTodo = {
        id: Number(todos[todos.length - 1].id) + 1,
        title: title,
        description: description
      }
      console.table(newTodo);
      addTodo(newTodo);
    }
  };

  return (
    <details>
      <summary>Ajouter une tâche</summary>
      <form action={handleSubmit} id="contactForm">
        <label htmlFor="title">Tâche</label>
        <input
          type="text"
          name="title"
          id="title"
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          rows={3}
          required
        ></textarea>
        <button
          type="submit"
          className="cta-links"
        >
          Ajouter
        </button>
      </form>
    </details>
  );
}
