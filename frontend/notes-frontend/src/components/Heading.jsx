import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

function Heading({}) {
  const {
    notes,
    fetchNotes,
    filterByStatus,
    filterByCategories,
    fetchCategories,
    categories,
    getAccessTokenSilently,
    isAuthenticated,
  } = useContext(NotesContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function createNote(e) {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        "https://notes-app-xk58.onrender.com/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            categories: selectedCategories.map((id) => ({ id })),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create note");
      const createdNote = await response.json();

      await fetchNotes();

      setTitle("");
      setContent("");
      setSelectedCategories([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }

  function toggleCategory(id) {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((catId) => catId !== id)
        : [...prevSelected, id]
    );
  }

  function handleFilterStatusChange(e) {
    filterByStatus(e.target.value);
  }

  function handleFilterCategoriesChange(e) {
    filterByCategories(e.target.value);
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center w-full max-w-[80%] mx-auto mt-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-black flex-shrink-0 order-1">
          Active Notes
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!isAuthenticated}
          className={`text-white font-medium rounded-lg text-sm px-4 py-2 flex-shrink-0 order-1
        ${
          isAuthenticated
            ? "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
            : "bg-blue-300 cursor-not-allowed"
        }
      `}
        >
          Create Note
        </button>

        <div className="max-w-sm flex-grow min-w-[180px] order-2">
          <select
            id="filterStatus"
            disabled={!isAuthenticated}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full text-sm px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          ${
            isAuthenticated
              ? "focus:ring-blue-500 focus:border-blue-500"
              : "opacity-50 cursor-not-allowed"
          }
        `}
            onChange={handleFilterStatusChange}
          >
            <option value="default">Filter by status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="max-w-sm flex-grow min-w-[180px] order-2">
          <select
            id="filterCategories"
            disabled={!isAuthenticated}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full text-sm px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          ${
            isAuthenticated
              ? "focus:ring-blue-500 focus:border-blue-500"
              : "opacity-50 cursor-not-allowed"
          }
        `}
            onChange={handleFilterCategoriesChange}
          >
            <option value="default">Filter by category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[90%] overflow-y-auto relative p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            <form className="space-y-6 mt-6" onSubmit={createNote}>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="title"
                  value={title}
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Write your ideas, thoughts or reminders..."
                ></textarea>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("dropdownBgHover")
                      ?.classList.toggle("hidden")
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
                  className="hidden absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-sm dark:bg-gray-700"
                >
                  <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            type="checkbox"
                            id={`cat-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            disabled={!isAuthenticated}
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
                disabled={!isAuthenticated}
                className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center
              ${
                isAuthenticated
                  ? "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
                  : "bg-blue-300 cursor-not-allowed"
              }
            `}
              >
                Create Note
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Heading;
