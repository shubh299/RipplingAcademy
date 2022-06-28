import { BrowserRouter, useRoutes } from "react-router-dom";
import NotesList from "./NoteList";
import NoteEdit from "./NoteEdit";
import React, { useEffect, useState } from "react";
import "./App.css";

export const NotesContext = React.createContext();

const AppRoutes = () => {
  let routes = useRoutes([
    {
      path: "/",
      element: <NotesList />,
    },
    {
      path: "/notes",
      element: <NotesList />,
    },
    {
      path: "/note/:note_id",
      element: <NoteEdit />,
    },
    {
      path: "*",
      element: `Page Not Found`,
    },
  ]);
  return routes;
};

const App = () => {
  const [notesMap, setNotesMap] = useState(() => {
    let stored_note_map = window.localStorage.getItem("notes");
    return stored_note_map ? new Map(JSON.parse(stored_note_map)) : new Map();
  });

  useEffect(() => {
    window.localStorage.setItem("notes",JSON.stringify([...notesMap]));
  },[notesMap]);

  return (
    <BrowserRouter>
      <NotesContext.Provider value={[notesMap,setNotesMap]}>
        <AppRoutes />
      </NotesContext.Provider>
    </BrowserRouter>
  );
};

export default App;
