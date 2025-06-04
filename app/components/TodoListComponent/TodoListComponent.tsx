import { useContext } from "react";
import { NavLink } from "react-router";
import { TodosContext } from "~/contexts/TodosContext";
import AddTodoComponent from "../AddTodoComponent/AddTodoComponent";

export default function TodoListComponent() {
  const { todos, getSessionTodos, setSessionTodos } =
    useContext(TodosContext);

  return (
    <article className="main-articles">
      <h2 className="main-articles-title">
        Liste des tâches
      </h2>
      <AddTodoComponent/>
      {todos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                ID
              </th>
              <th>
                Tâche
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {todos.map((todo: any) => (
            <tr key={todo.id}>
              <td>
                {todo.id}
              </td>
              <td>
                {todo.title}
              </td>
              <td>
                <NavLink to={`/todos/${todo.id}`}>
                  Gérer
                </NavLink>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </article>
  );
}
