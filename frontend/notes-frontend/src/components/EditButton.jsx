import { useState, useEffect } from "react";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

function EditButton({ id, title, content, isArchived }) {
  const { fetchNotes, fetchCategories, getAccessTokenSilently, categories } =
    useContext(NotesContext);

  const [showModal, setShowModal] = useState(false);

  // Todos las categorías que existen en la base
  const [allCategories, setAllCategories] = useState([]);

  // Estados para inputs editables
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  // IDs de categorías seleccionadas para la nota
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch para traer todas las categorías cuando se abre el modal
  useEffect(() => {
    if (showModal) {
      fetchCategories();
      setEditTitle(title);
      setEditContent(content);
      setSelectedCategories(categories ? categories.map((c) => c.id) : []);
    }
  }, [showModal]);

  // Función para toggle de categorías seleccionadas
  function toggleCategory(catId) {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  }

  async function updateNote(e) {
    e.preventDefault();

    const dataToSend = {
      title: editTitle,
      content: editContent,
      isArchived,
      categories: selectedCategories.map((id) => ({ id })),
    };

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `https://notes-app-xk58.onrender.com/notes/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) throw new Error("Failed to update note");

      setShowModal(false);
      alert("Note updated successfully!");
      fetchNotes();
    } catch (error) {
      console.error(error);
      alert("Error updating note");
    }
  }

  return (
    <div>
      <button
        type="button"
        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => setShowModal(true)}
      >
        Edit
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[90%] overflow-y-auto relative p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <form className="space-y-6 mt-6" onSubmit={updateNote}>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder=" "
                  required
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                />
                <label
                  htmlFor="title"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Title
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <textarea
                  name="content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows="4"
                  className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>

              {/* Dropdown Category */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("dropdownBgHover")
                      .classList.toggle("hidden")
                  }
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Select Categories
                  <svg
                    className="w-2.5 h-2.5 ml-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                <div
                  id="dropdownBgHover"
                  className="hidden absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-sm dark:bg-gray-700 max-h-48 overflow-auto"
                >
                  <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {allCategories.map((category) => (
                      <li key={category.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            type="checkbox"
                            id={`cat-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor={`cat-${category.id}`}
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {category.name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Update Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditButton;
