import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { TodosContext } from "~/contexts/TodosContext";
import type { TodoI } from "~/models/todos.interface";
import "./TodoComponent.css";

export default function TodoComponent() {
  const params = useParams();
  const todoId = Number(params.todoId);
  const navigate = useNavigate();

  const {
    todos,
    getSessionTodos,
    setSessionTodos,
    deleteSessionTodos,
    updateTodos
  } = useContext(TodosContext);

  const [todo, setTodo] = useState({} as TodoI);
  const [loading, setLoading] = useState(true);
  const [modifyMode, setModifyMode] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const description = useRef<HTMLParagraphElement>(null);

  if (!todoId) navigate("/todos");

  const toggleModifyMode = () => {
    setModifyMode((prev) => !prev);
  };

  const removeTodo = (todo: TodoI, todos: TodoI[]) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cette tâche ?"
      )
    ) {
      const newTodos = todos.filter(
        (t: TodoI) => Number(t.id) !== Number(todo.id)
      );
      deleteSessionTodos(newTodos);
    }
    navigate("/todos");
  };

  const modifyTodo = (todo: TodoI, todos: TodoI[]) => {
    const newTodos = todos.map((t: TodoI) => {
      if (Number(t.id) === Number(todo.id)) return todo;
      return t;
    });
    setSessionTodos(newTodos);
    updateTodos(newTodos);
    
    console.log("modify");
  };

  const handleModify = () => {
    const newTitle = (title.current && title.current.innerText) ?? "";
    const newDescription = (description.current && description.current.innerText) ?? "";

    console.log(newTitle, newDescription);

    if(newTitle.length > 0 && newDescription.length > 0){
      const newTodo = {
        ...todo,
        title: newTitle,
        description: newDescription
      }
      modifyTodo(newTodo, todos);
    }

    setModifyMode(false);
  };

  useEffect(() => {
    (async () => {
      if (loading && todos) {
        const actualTodo:TodoI = await todos.find(
          (todo: TodoI) => Number(todo.id) === todoId
        );
        setTodo(actualTodo);
        if (actualTodo) {
          setLoading(false);
        }
      }
    })();

  }, [loading, todos, title, description]);

  return !todo ? (
    <article className="main-articles">
      <h2 className="main-articles-title">{loading ? "Chargement" : "Erreur"}</h2>
      {loading && (<p>Les données sont en cours de récupération...</p>)}
      {!loading && (<p>Aucun contenu ne correspond à votre recherche. <NavLink to="/todos">Revenir sur la liste des tâches</NavLink></p>)}
    </article>
  ) : (
    <article className="main-articles">
      <h2
        className="main-articles-title"
        contentEditable={modifyMode}
        suppressContentEditableWarning={true}
        ref={title}
      >
        {todo.title}
      </h2>
      <p
        contentEditable={modifyMode}
        suppressContentEditableWarning={true}
        ref={description}
      >
        {todo.description}
      </p>
      <aside className="cta-links-container">
        <button
          onClick={() => removeTodo(todo, todos)}
          className="cta-links cta-links-secondary"
        >
          Supprimer
        </button>
        <button
          className="cta-links"
          onClick={() =>
            !modifyMode
              ? toggleModifyMode()
              : handleModify()
          }
        >
          {modifyMode ? "Valider" : "Modifier"}
        </button>
      </aside>
    </article>
  );
}
