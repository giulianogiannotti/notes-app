import React, { createContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "archived"
  const [categoryFilter, setCategoryFilter] = useState("default"); // "default" o nombre de categoría
  const [categories, setCategories] = useState([]);

  async function fetchNotes() {
    if (!isAuthenticated) {
      setNotes([]);
      return;
    }
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        "https://notes-app-xk58.onrender.com/notes/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching notes: ${errorText}`);
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  }

  async function fetchCategories() {
    if (!isAuthenticated) {
      setCategories([]);
      return;
    }
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        "https://notes-app-xk58.onrender.com/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  }

  useEffect(() => {
    async function loginBackend() {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const res = await fetch(
          "https://notes-app-xk58.onrender.com/auth/login",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
      }
    }
    loginBackend();
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
      fetchCategories();
    } else {
      setNotes([]);
      setCategories([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let result = [...notes];

    if (statusFilter === "active") {
      result = result.filter((note) => !note.isArchived);
    } else if (statusFilter === "archived") {
      result = result.filter((note) => note.isArchived);
    }

    if (categoryFilter !== "default") {
      result = result.filter((note) =>
        note.categories.some((cat) => cat.name === categoryFilter)
      );
    }

    setFilteredNotes(result);
  }, [notes, statusFilter, categoryFilter]);

  function filterByStatus(filter) {
    setStatusFilter(filter);
  }

  function filterByCategories(category) {
    setCategoryFilter(category);
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        categories,
        fetchNotes,
        fetchCategories,
        filterByStatus,
        filterByCategories,
        getAccessTokenSilently,
        isAuthenticated,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
