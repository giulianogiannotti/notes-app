import { useState } from "react";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

function DeleteButton({ id }) {
  const [showModal, setShowModal] = useState(false);
  const { fetchNotes, getAccessTokenSilently } = useContext(NotesContext);

  async function deleteNote() {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setShowModal(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center text-center text-white rounded-lg bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 ml-3 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={() => setShowModal(true)}
      >
        Delete
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700 p-6 w-full max-w-md">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this note?
            </h3>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                onClick={deleteNote}
              >
                Yes, I'm sure
              </button>
              <button
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteButton;
