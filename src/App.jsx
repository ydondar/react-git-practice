import React, { useState, useEffect, useRef } from 'react';

function TodoApp() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef(null);
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  function handleAddItem() {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError('Cannot be empty');
      return;
    }

    const alreadyExist = items.some(
      (item) => item.text.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (alreadyExist) {
      alert('Item already exists in the list');
      return;
    }

    const newItems = {
      id: crypto.randomUUID(),
      text: trimmedInput,
      done: false,
    };

    setError('');
    setItems((prev) => [...prev, newItems]);
    setInput('');
  }

  function handleDeleteItem(deleteId) {
    const newItems = items.filter((item) => deleteId !== item.id);
    setItems(newItems);
  }

  function toggleItem(toggleId) {
    const newItems = items.map((item) => {
      if (toggleId === item.id) {
        return { ...item, done: !item.done };
      }
      return item;
    });
    setItems(newItems);
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
      setError('Cannot save empty value');
      return;
    }

    const alreadyExist = items.some(
      (item) =>
        item.text.toLowerCase() === trimmedValue.toLowerCase() &&
        item.id !== editingId
    );

    if (alreadyExist) {
      alert('Item already exists in the list');
      return;
    }

    const newItems = items.map((item) => {
      if (item.id === editingId) {
        return { ...item, text: trimmedValue };
      }
      return item;
    });

    setItems(newItems);
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

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
      />
      <button onClick={handleAddItem}>Add</button>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
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

      {error && <p>{error}</p>}
    </div>
  );
}

export default TodoApp;
