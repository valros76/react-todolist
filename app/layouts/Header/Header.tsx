import { NavLink } from "react-router";
import MainNav from "~/navigation/MainNav/MainNav";

export default function Header(){
  return(
    <header className="main-head">
      <h1 className="main-head-title">
        Todolist
      </h1>
      <MainNav/>
    </header>
  );
}