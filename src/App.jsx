function TodoApp() { 
  const [input, setInput] = useState('');
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(items));
  }, [items]);

  function handleAddItem() {
    if (input.trim() === '') {  
    alert('Boş bırakmayın');
    return;
    }

    const alreadyExists = items.some(
      (item) => item.text.toLowerCase() === input.toLowerCase()
    );
  
    if (alreadyExists) {
      alert('Bu eleman zaten listede ekli');
      return;
    }

    const newItem = {
      id : Date.now(),
      text : input,
      done: false,
    };

    setItems([...items, newItem]);
    setInput('');

  }

  function handleDeleteItem(deleteId) {
    const newItem = items.filter((item) => {
      return item.id !== deleteId;
    })
    setItems(newItem);
  }

  function toggleItem(toggleId) {
    const newItem = items.map((item) => {
    if (toggleId === item.id) {
    return {...item, done: !item.done}
    }
    return item;
  });

  setItems(newItem);
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAddItem}>Ekle</button>
    
      <ul>
        {items.map((item) => (
          <li key={item.id}>
        <span className = { item.done ? "todo-text done" : "todo-text" }>
            {item.text}
        </span>
        <button onClick={() => toggleItem(item.id)}>
        {item.done ? "Geri Al" : "Tamamlandı"}
        </button>
        <button onClick={() => handleDeleteItem(item.id)}>Sil</button> 
        </li>
        ))}
      </ul>

    </div>
  );
  
}

export default App;