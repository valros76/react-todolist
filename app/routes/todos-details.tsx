import TodoComponent from "~/components/TodoComponent/TodoComponent";
import type { Route } from "./+types/home";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo Detail" },
    {
      name: "description",
      content: "A simple detailled todo object in React",
    },
  ];
}

export default function TodosDetails() {
  return (
    <section className="main-sections">
      <NavLink to="/todos" className="cta-links">
      Retour
      </NavLink>
      <TodoComponent />
    </section>
  );
}
