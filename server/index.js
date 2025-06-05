import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, NavLink, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useParams, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, createContext, useEffect, useContext, useRef } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function MainNav() {
  const [menuState, setMenuState] = useState(false);
  const toggleMenu = () => {
    setMenuState((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "nav-btn",
        "data-state": menuState ? "open" : "close",
        onClick: toggleMenu,
        children: [
          !menuState && /* @__PURE__ */ jsx("span", { className: "nav-btn-icon-open", children: /* @__PURE__ */ jsx("i", { className: "material-symbols-rounded", children: " menu " }) }),
          menuState && /* @__PURE__ */ jsx("span", { className: "nav-btn-icon-close", children: "❌" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("nav", { className: `main-nav ${menuState ? "open" : "close"}`, children: /* @__PURE__ */ jsxs("menu", { className: "main-menu", children: [
      /* @__PURE__ */ jsx("li", { className: "main-menu-items", children: /* @__PURE__ */ jsx(NavLink, { to: "/", className: "main-menu-links", children: "Accueil" }) }),
      /* @__PURE__ */ jsx("li", { className: "main-menu-items", children: /* @__PURE__ */ jsx(NavLink, { to: "/todos", className: "main-menu-links", children: "Gestionnaire de tâches" }) })
    ] }) })
  ] });
}
function Header() {
  return /* @__PURE__ */ jsxs("header", { className: "main-head", children: [
    /* @__PURE__ */ jsx("h1", { className: "main-head-title", children: "Todolist" }),
    /* @__PURE__ */ jsx(MainNav, {})
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "main-foot", children: /* @__PURE__ */ jsx("p", { className: "copyright", children: "© Webdevoo - 2025" }) });
}
const TodosContext = createContext(null);
const TodosProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(true);
  const [todos2, setTodos] = useState([]);
  const getSessionTodos = () => {
    const sessionTodos = localStorage.getItem("todos");
    return sessionTodos ? JSON.parse(sessionTodos) : null;
  };
  const setSessionTodos = (datas) => {
    localStorage.setItem("todos", JSON.stringify(datas));
  };
  const deleteSessionTodos = () => {
    localStorage.removeItem("todos");
  };
  const addTodo = (newTodo) => {
    const newTodos = [...todos2, newTodo];
    setSessionTodos(newTodos);
    updateTodos(newTodos);
  };
  const updateTodos = (todos22) => {
    setTodos(todos22);
  };
  const updateTodosWithSession = (todos22) => {
    const savedTodos = getSessionTodos();
    if (savedTodos)
      setTodos(savedTodos), setLoading(false), console.log(
        `%c Todos mis à jour depuis le localStorage`,
        `color: #ba3;`
      );
  };
  useEffect(() => {
    if (loading) {
      (async () => {
        const savedTodos = getSessionTodos();
        if (!savedTodos) {
          await fetch("/app/datas/todos.json").then((result) => result.ok && result.json()).then(
            (datas) => (setTodos(datas), setSessionTodos(datas), setLoading(false), console.log(
              `%c Todos chargées depuis le fichier json`,
              `color: #e26;`
            ))
          ).catch(
            (err) => console.error(`Erreur : ${err}`)
          );
        }
        if (savedTodos)
          setTodos(savedTodos), setLoading(false), console.log(
            `%c Todos chargées depuis le localStorage`,
            `color: #ba3;`
          );
      })();
    }
  });
  return /* @__PURE__ */ jsx(
    TodosContext.Provider,
    {
      value: {
        todos: todos2,
        setSessionTodos,
        deleteSessionTodos,
        updateTodos,
        updateTodosWithSession,
        addTodo
      },
      children
    }
  );
};
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,600,1,0"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "fr",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsxs(TodosProvider, {
        children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("main", {
          className: "main-content",
          children
        }), /* @__PURE__ */ jsx(Footer, {})]
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("section", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function meta$2({}) {
  return [{
    title: "Todolist React"
  }, {
    name: "description",
    content: "A simple todolist in React"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("section", {
    className: "main-sections",
    children: [/* @__PURE__ */ jsx("h2", {
      className: "main-sections-title",
      children: "Bienvenue"
    }), /* @__PURE__ */ jsx("p", {
      children: "Vous êtes arrivés sur le Manager de Todolist, en React, de Webdevoo."
    }), /* @__PURE__ */ jsx("p", {
      children: "Nous vous invitons à découvrir l'outil :"
    }), /* @__PURE__ */ jsx(NavLink, {
      to: "/todos",
      className: "cta-links",
      children: "Gérer mes tâches"
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function AddTodoComponent() {
  const {
    setSessionTodos,
    updateTodos,
    updateTodosWithSession,
    addTodo,
    todos: todos2
  } = useContext(TodosContext);
  const handleSubmit = (formData) => {
    const title = `${formData.get("title")}`;
    const description = `${formData.get("description")}`;
    if (title.length > 0 && description.length > 0) {
      const newTodo = {
        id: Number(todos2[todos2.length - 1].id) + 1,
        title,
        description
      };
      console.table(newTodo);
      addTodo(newTodo);
    }
  };
  return /* @__PURE__ */ jsxs("details", { children: [
    /* @__PURE__ */ jsx("summary", { children: "Ajouter une tâche" }),
    /* @__PURE__ */ jsxs("form", { action: handleSubmit, id: "contactForm", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "title", children: "Tâche" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          name: "title",
          id: "title",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("label", { htmlFor: "description", children: "Description" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          name: "description",
          id: "description",
          rows: 3,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "cta-links",
          children: "Ajouter"
        }
      )
    ] })
  ] });
}
function TodoListComponent() {
  const { todos: todos2, getSessionTodos, setSessionTodos } = useContext(TodosContext);
  return /* @__PURE__ */ jsxs("article", { className: "main-articles", children: [
    /* @__PURE__ */ jsx("h2", { className: "main-articles-title", children: "Liste des tâches" }),
    /* @__PURE__ */ jsx(AddTodoComponent, {}),
    todos2.length > 0 && /* @__PURE__ */ jsxs("table", { children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "ID" }),
        /* @__PURE__ */ jsx("th", { children: "Tâche" }),
        /* @__PURE__ */ jsx("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: todos2.map((todo) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { children: todo.id }),
        /* @__PURE__ */ jsx("td", { children: todo.title }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(NavLink, { to: `/todos/${todo.id}`, children: "Gérer" }) })
      ] }, todo.id)) })
    ] })
  ] });
}
function meta$1({}) {
  return [{
    title: "Todos"
  }, {
    name: "description",
    content: "A simple todos manager in React"
  }];
}
const todos = UNSAFE_withComponentProps(function Todos() {
  return /* @__PURE__ */ jsxs("section", {
    className: "main-sections",
    children: [/* @__PURE__ */ jsx("h2", {
      className: "main-sections-title",
      children: "Todos Manager"
    }), /* @__PURE__ */ jsx(TodoListComponent, {})]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: todos,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function TodoComponent() {
  const params = useParams();
  const todoId = Number(params.todoId);
  const navigate = useNavigate();
  const {
    todos: todos2,
    getSessionTodos,
    setSessionTodos,
    deleteSessionTodos,
    updateTodos
  } = useContext(TodosContext);
  const [todo, setTodo] = useState({});
  const [loading, setLoading] = useState(true);
  const [modifyMode, setModifyMode] = useState(false);
  const title = useRef(null);
  const description = useRef(null);
  if (!todoId) navigate("/todos");
  const toggleModifyMode = () => {
    setModifyMode((prev) => !prev);
  };
  const removeTodo = (todo2, todos22) => {
    if (confirm(
      "Êtes-vous sûr de vouloir supprimer cette tâche ?"
    )) {
      const newTodos = todos22.filter(
        (t) => Number(t.id) !== Number(todo2.id)
      );
      deleteSessionTodos(newTodos);
    }
    navigate("/todos");
  };
  const modifyTodo = (todo2, todos22) => {
    const newTodos = todos22.map((t) => {
      if (Number(t.id) === Number(todo2.id)) return todo2;
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
    if (newTitle.length > 0 && newDescription.length > 0) {
      const newTodo = {
        ...todo,
        title: newTitle,
        description: newDescription
      };
      modifyTodo(newTodo, todos2);
    }
    setModifyMode(false);
  };
  useEffect(() => {
    (async () => {
      if (loading && todos2) {
        const actualTodo = await todos2.find(
          (todo2) => Number(todo2.id) === todoId
        );
        setTodo(actualTodo);
        if (actualTodo) {
          setLoading(false);
        }
      }
    })();
  }, [loading, todos2, title, description]);
  return !todo ? /* @__PURE__ */ jsxs("article", { className: "main-articles", children: [
    /* @__PURE__ */ jsx("h2", { className: "main-articles-title", children: loading ? "Chargement" : "Erreur" }),
    loading && /* @__PURE__ */ jsx("p", { children: "Les données sont en cours de récupération..." }),
    !loading && /* @__PURE__ */ jsxs("p", { children: [
      "Aucun contenu ne correspond à votre recherche. ",
      /* @__PURE__ */ jsx(NavLink, { to: "/todos", children: "Revenir sur la liste des tâches" })
    ] })
  ] }) : /* @__PURE__ */ jsxs("article", { className: "main-articles", children: [
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "main-articles-title",
        contentEditable: modifyMode,
        suppressContentEditableWarning: true,
        ref: title,
        children: todo.title
      }
    ),
    /* @__PURE__ */ jsx(
      "p",
      {
        contentEditable: modifyMode,
        suppressContentEditableWarning: true,
        ref: description,
        children: todo.description
      }
    ),
    /* @__PURE__ */ jsxs("aside", { className: "cta-links-container", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => removeTodo(todo, todos2),
          className: "cta-links cta-links-secondary",
          children: "Supprimer"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "cta-links",
          onClick: () => !modifyMode ? toggleModifyMode() : handleModify(),
          children: modifyMode ? "Valider" : "Modifier"
        }
      )
    ] })
  ] });
}
function meta({}) {
  return [{
    title: "Todo Detail"
  }, {
    name: "description",
    content: "A simple detailled todo object in React"
  }];
}
const todosDetails = UNSAFE_withComponentProps(function TodosDetails() {
  return /* @__PURE__ */ jsxs("section", {
    className: "main-sections",
    children: [/* @__PURE__ */ jsx(NavLink, {
      to: "/todos",
      className: "cta-links",
      children: "Retour"
    }), /* @__PURE__ */ jsx(TodoComponent, {})]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: todosDetails,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B4_8Gdwo.js", "imports": ["/assets/chunk-NL6KNZEE-p7aHl_Kw.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-xIkqPOsM.js", "imports": ["/assets/chunk-NL6KNZEE-p7aHl_Kw.js", "/assets/TodosContext-4jH2hRnW.js"], "css": ["/assets/root-CH01e_5_.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-C9pikHWk.js", "imports": ["/assets/chunk-NL6KNZEE-p7aHl_Kw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/todos": { "id": "routes/todos", "parentId": "root", "path": "todos", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/todos-DUJvgRnd.js", "imports": ["/assets/chunk-NL6KNZEE-p7aHl_Kw.js", "/assets/TodosContext-4jH2hRnW.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/todos-details": { "id": "routes/todos-details", "parentId": "root", "path": "todos/:todoId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/todos-details-CdiP9s5M.js", "imports": ["/assets/chunk-NL6KNZEE-p7aHl_Kw.js", "/assets/TodosContext-4jH2hRnW.js"], "css": ["/assets/todos-details-N4a1fTK1.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-c015d2d8.js", "version": "c015d2d8", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/todos": {
    id: "routes/todos",
    parentId: "root",
    path: "todos",
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/todos-details": {
    id: "routes/todos-details",
    parentId: "root",
    path: "todos/:todoId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
