import React, { useState } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        const value = inputValue.trim();

        if (!value) {
            return;
        }

        setTodos((prevTodos) => [...prevTodos, value]);
        setInputValue('');
    };

    const handleDelete = (index) => {
        setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h1>Todo List</h1>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter a new todo"
            />
            <button type="button" onClick={handleSubmit}>Add Todo</button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>
                        {todo}
                        <button onClick={() => handleDelete(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;