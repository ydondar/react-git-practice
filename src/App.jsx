import React, { useState, useEffect } from 'react';

function TodoApp() {   

  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  function handleAddItem() { 
    
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError('Boş bırakmayın');
      return;
    }

    const alreadyExist = items.some((item) => {
      return item.text.toLowerCase() === trimmedInput.toLowerCase();
    });

    if (alreadyExist) {
      alert('Aynı eleman listede ekli');
      return;
    }

    const newItems = { 
      
      id: Date.now(),
      text: input,
      done: false,
    };

    setError(''); 
    setItems((prev) => [...prev, newItems]);
    setInput('');
  }

  function handleDeleteItem(deleteId) {  
  
    const newItems = items.filter((item) => {
      return deleteId !== item.id;
    });
    setItems(newItems);
  }

  function toggleItem(toggleId) { 
    const newItems = items.map((item) => {
      if (item.id === toggleId) {
        return {...item, done: !item.done}
      }
      return item;
    });
    setItems(newItems);
  }

 function handleEditItem(editId) { 
   const foundItem = items.find(item => editId === item.id)
  setEditingId(editId);
  setEditValue(foundItem.text)
}

function handleSaveEdit() { 
  const newItems = items.map((item) => {
    if (item.id === editingId) {
      return {...item, text: editValue};
    }
    return item;
  });
  setItems(newItems);
  setEditingId(null); 
  setEditValue("");     
}

function handleCancelEdit() {
  setEditingId(null);
  setEditValue("");
}

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => (e.key === "Enter") && handleAddItem()}/> 
      <button onClick={handleAddItem}>Ekle</button> 
      <ul>
        {items.map(
          (
            item 
          ) => (
            <li key={item.id}>
              {editingId === item.id ? 
               <> 
              <input value={editValue} onChange={(e) => setEditValue(e.target.value)}/>
              <button onClick={handleSaveEdit}>Kaydet</button> 
              <button onClick={handleCancelEdit}>İptal</button> 
              </> 
              :
              <>
              <span className={item.done ? "todo-text done" : "todo-text"}>
                {item.text}
              </span>
              <button onClick={() => toggleItem(item.id)}>
              {item.done ? "Geri Al" : "Tamamla"}
              </button> 
              <button onClick={() => handleDeleteItem(item.id)}>Sil</button> 
              <button onClick={() => handleEditItem(item.id)}>Düzenle</button> 
              </>
            }
            </li>
          )
        )}
      </ul>
      {error && <p>{error}</p>}
    </div>
  );
}
export default TodoApp;
