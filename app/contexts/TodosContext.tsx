import { createContext, useEffect, useState, type ReactNode } from "react";
import type { TodoI } from "~/models/todos.interface";


export const TodosContext = createContext<any>(null!);

export const TodosProvider = ({children}: {children: ReactNode}) => {
  
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<TodoI[]>([]);

  const getSessionTodos = () => {
    const sessionTodos = localStorage.getItem("todos");
    return sessionTodos ? JSON.parse(sessionTodos) : null;
  }

  const setSessionTodos = (datas: TodoI[]) => {
    localStorage.setItem("todos", JSON.stringify(datas));
  }

  const deleteSessionTodos = () => {
    localStorage.removeItem("todos");
  }

  const updateTodos = (todos:TodoI[]) => {
    setTodos(todos);
  }

  useEffect(() => {
    if(loading){
      (async () => {
        const savedTodos = getSessionTodos();
        if(!savedTodos) {
          await fetch("/app/datas/todos.json")
          .then(result => result.ok && result.json())
          .then(datas => (setTodos(datas), setSessionTodos(datas), setLoading(false), console.log(`%c Todos chargées depuis le fichier json`, `color: #e26;`)))
          .catch(err => console.error(`Erreur : ${err}`));
        }
        if(savedTodos) (setTodos(savedTodos), setLoading(false), console.log(`%c Todos chargées depuis le localStorage`, `color: #ba3;`));
      })();
    }
  });
  
  return(
    <TodosContext.Provider value={{
      todos,
      setSessionTodos,
      deleteSessionTodos,
      updateTodos
    }}>
      {children}
    </TodosContext.Provider>
  );
}