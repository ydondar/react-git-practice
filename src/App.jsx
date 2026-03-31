import React, { useState, useEffect, useRef } from 'react';

function TodoApp() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  const [filter, setFilter] = useState(() => {
    const savedFilter = localStorage.getItem('todoFilter');
    return savedFilter ? savedFilter : 'all';
  });

  useEffect(() => {
    localStorage.setItem('todoFilter', filter);
  }, [filter]);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  function handleAddItem() {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError('This field cannot be empty');
      return;
    }

    const alreadyExist = items.some((item) => 
    item.text.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (alreadyExist) {
      setError('Item already exists in the list');
      return;
    }

    const newItem = {
      id: Date.now(),
      text: trimmedInput,
      done: false,
    };

    setError('');
    setItems((prev) => [...prev, newItem]);
    setInput('');
  }

  function handleDeleteItem(deleteId) {
    const updatesItems = items.filter((item) => item.id !== deleteId);
    setItems(updatesItems);
  }

  function toggleItem(toggleId) {
    const updateItems = items.map((item) => {
      if (toggleId === item.id) {
        return { ...item, done: !item.done };
      }
      return item;
    });
    setItems(updateItems);
  }

  function handleEditItem(editId) {
    const foundItems = items.find((item) => editId === item.id);
    if (!foundItems) return;
    setEditingId(editId);
    setEditValue(foundItems.text);
  }

  function handleSaveItem() {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      setError('This field cannot be empty');
      return;
    }

    const alreadyExist = items.some(
      (item) =>
        item.text.toLowerCase() === trimmedValue.toLowerCase() &&
        item.id !== editingId
    );

    if (alreadyExist) {
      setError('Item already exists in the list');
      return;
    }

    const updateItems = items.map((item) => {
      if (item.id === editingId) {
        return { ...item, text: trimmedValue };
      }
      return item;
    });

    setItems(updateItems);
    setEditingId(null);
    setEditValue('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditValue('');
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'active') return !item.done;
    if (filter === 'completed') return item.done;
    return true;
  });

  function clearCompletedItem() {
    const updateItems = items.filter((item) => !item.done);
    setItems(updateItems);
  }

  const hasCompletedItems = items.some((item) => item.done);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
      />
      <button onClick={handleAddItem} disabled={!input.trim()}>
        Add
      </button>
      {items.length > 0 && (
        <div>
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('active')}>Active</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
        </div>
      )}
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    e.key === 'Enter' && handleSaveItem();
                    e.key === 'Escape' && handleCancelEdit();
                  }}
                />
                <button onClick={handleSaveItem}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className={item.done ? 'todo-text done' : 'todo-text'}>
                  {item.text}
                </span>
                <button onClick={() => handleEditItem(item.id)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </button>
                <button onClick={() => toggleItem(item.id)}>
                  {item.done ? 'Undo' : 'Complete'}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {hasCompletedItems && (
        <button onClick={clearCompletedItem} disabled={!hasCompletedItems}>
          Clear Completed
        </button>
      )}
      {error && <p>{error}</p>}
      {items.length > 0 && <p> Current filter: {filter} </p>}
    </div>
  );
}

export default TodoApp;
