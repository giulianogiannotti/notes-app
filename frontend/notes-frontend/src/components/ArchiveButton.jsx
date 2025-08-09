import { useState } from "react";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

function ArchiveButton({ id, isArchived }) {
  const [archived, setArchived] = useState(isArchived);
  const { fetchNotes, getAccessTokenSilently } = useContext(NotesContext);

  async function archiveNote() {
    try {
      const token = await getAccessTokenSilently();

      const url = archived
        ? `http://localhost:3000/notes/${id}/unarchive`
        : `http://localhost:3000/notes/${id}/archive`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error archiving note: ${errorText}`);
      }

      setArchived(!archived);

      await fetchNotes();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      {archived ? (
        <button
          type="button"
          className="inline-flex items-center text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-green-300 font-medium text-sm px-5 py-2.5 me-2 ml-3 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
          onClick={archiveNote}
        >
          Unarchive
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex items-center text-center text-white rounded-lg bg-green-700 hover:bg-green-800 focus:ring-green-300 font-medium text-sm px-5 py-2.5 me-2 ml-3 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
          onClick={archiveNote}
        >
          Archive
        </button>
      )}
    </div>
  );
}

export default ArchiveButton;
