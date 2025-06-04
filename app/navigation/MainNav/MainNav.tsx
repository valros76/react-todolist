import { useState, useRef } from "react";
import { NavLink } from "react-router";

export default function MainNav(){

  const [menuState, setMenuState] = useState(false);

  const toggleMenu = () => {
    setMenuState(prev => !prev);
  }

  return(<>
  <button
    className="nav-btn"
    data-state={menuState ? "open" : "close"}
    onClick={toggleMenu}
  >
    {!menuState && (<span className="nav-btn-icon-open">
      <i className="material-symbols-rounded"> menu </i>
    </span>)}
    {menuState && (<span className="nav-btn-icon-close">❌</span>)}
  </button>
  <nav className={`main-nav ${menuState ? "open" : "close"}`}>
    <menu className="main-menu">
      <li className="main-menu-items">
        <NavLink to="/" className="main-menu-links">
          Accueil
        </NavLink>
      </li>
      <li className="main-menu-items">
        <NavLink to="/todos" className="main-menu-links">
          Gestionnaire de tâches
        </NavLink>
      </li>
    </menu>
  </nav>
  </>);
}