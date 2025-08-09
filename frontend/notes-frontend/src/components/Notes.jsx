import { use } from "react";
import Note from "./Note";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
function Notes({ notes }) {
  const { filteredNotes } = useContext(NotesContext);

  return (
    <div class="row mt-6 flex flex-wrap justify-center ">
      {filteredNotes
        .slice()
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((note) => (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            isArchived={note.isArchived}
            categories={note.categories}
          />
        ))}
    </div>
  );
}

export default Notes;
