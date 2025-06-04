import TodoListComponent from "~/components/TodoListComponent/TodoListComponent";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todos" },
    { name: "description", content: "A simple todos manager in React" },
  ];
}

export default function Todos() {
  return <section className="main-sections">
    <h2 className="main-sections-title">Todos Manager</h2>
    <TodoListComponent/>
  </section>;
}
