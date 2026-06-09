import React, { useState, useEffect, useRef } from "react";

function TodoApp() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [search, setSearch] = useState("");
  const editInputRef = useRef(null);

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("todos");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("JSON parse error:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(items));
    } catch (error) {
      console.error(error);
    }
  }, [items]);

  const [filter, setFilter] = useState(() => {
    try {
      const savedFilter = localStorage.getItem("todoFilter");
      return savedFilter ? savedFilter : "all";
    } catch (error) {
      console.error(error);
      return "all";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("todoFilter", filter);
    } catch (error) {
      console.error(error);
    }
  }, [filter]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingId]);

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkmode");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("darkmode", JSON.stringify(darkMode));
    } catch (error) {
      console.error(error);
    }
  }, [darkMode]);

  function handleAddItem() {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError("Please enter a task");
      return;
    }

    const alreadyExist = items.some(
      (item) => trimmedInput.toLowerCase() === item.text.toLowerCase()
    );

    if (alreadyExist) {
      setError("This task already exists");
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      text: trimmedInput,
      done: false,
    };

    setError("");
    setItems((prev) => [...prev, newItem]);
    setInput("");
  }

  function handleDeleteItem(deleteId) {
    const updatedItems = items.filter((item) => item.id !== deleteId);
    setItems(updatedItems);
    setError("");
  }

  function toggleItem(toggleId) {
    const updatedItems = items.map((item) => {
      if (item.id === toggleId) {
        return { ...item, done: !item.done };
      }
      return item;
    });
    setItems(updatedItems);
  }

  function handleEditItem(editId) {
    const foundItem = items.find((item) => item.id === editId);
    if (!foundItem) return;
    setEditingId(editId);
    setEditValue(foundItem.text);
  }

  function handleSaveItem() {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      setError("Task cannot be empty");
      return;
    }

    const alreadyExist = items.some(
      (item) =>
        item.text.toLowerCase() === trimmedValue.toLowerCase() &&
        item.id !== editingId
    );

    if (alreadyExist) {
      setError("This task already exists");
      return;
    }

    const updatedItems = items.map((item) => {
      if (item.id === editingId) {
        return { ...item, text: trimmedValue };
      }
      return item;
    });
    setItems(updatedItems);
    setEditingId(null);
    setEditValue("");
    setError("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditValue("");
    setError("");
  }

  const filteredItems = items.filter((item) => {
    const text = item.text.toLowerCase();
    const query = search.trim().toLowerCase();

    const matchesSearch = text.includes(query);

    if (filter === "active") return !item.done && matchesSearch;
    if (filter === "completed") return item.done && matchesSearch;
    return matchesSearch;
  });

  function clearCompletedItems() {
    const activeItems = items.filter((item) => !item.done);
    setItems(activeItems);
    setError("");
  }

  const hasCompletedItems = items.some((item) => item.done);

  return (
    <div className={`todo-container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <h2>Todo App</h2>
        <div className="header-right">
          <span className="badge">{filteredItems.length} tasks</span>
          <button
            className={`dark-btn ${darkMode ? "to-light" : "to-dark"}`}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      <div className="todo-row">
        <input
          value={input}
          placeholder="Please add a task"
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
        />
        <button
          className="add-btn"
          onClick={handleAddItem}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>
      {error && <p className="message-box error-text">{error}</p>}
      {items.length > 0 && (
        <div className="search-container">
          <div className="search-input">
            <input
              value={search}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="todo-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
      )}
      <ul className="todo-list">
        {filteredItems.map((item) => (
          <li className="todo-item" key={item.id}>
            {item.id === editingId ? (
              <>
                <input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveItem();
                    else if (e.key === "Escape") handleCancelEdit();
                  }}
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSaveItem}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className={`todo-text ${item.done ? "done" : ""}`}>
                  {item.text}
                </span>
                <div className="items-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditItem(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="item-complete-btn"
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.done ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="completed-container">
        {hasCompletedItems && (
          <button className="completed-btn" onClick={clearCompletedItems}>
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}
export default TodoApp;
