import { NavLink } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todolist React" },
    {
      name: "description",
      content: "A simple todolist in React",
    },
  ];
}

export default function Home() {
  return (
    <section className="main-sections">
      <h2 className="main-sections-title">Bienvenue</h2>
      <p>
        Vous êtes arrivés sur le Manager de Todolist, en
        React, de Webdevoo.
      </p>
      <p>Nous vous invitons à découvrir l'outil :</p>
      <NavLink
        to="/todos"
        className="cta-links"
      >
        Gérer mes tâches
      </NavLink>
    </section>
  );
}
