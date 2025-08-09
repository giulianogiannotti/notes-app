import React from "react";
import { NotesProvider } from "./context/NotesContext.jsx";
import Nav from "./components/Nav";
import Heading from "./components/Heading";
import ArchiveButton from "./components/ArchiveButton";
import Notes from "./components/Notes";

function App() {
  return (
    <NotesProvider>
      <Nav />
      <Heading />
      <Notes />
    </NotesProvider>
  );
}

export default App;
