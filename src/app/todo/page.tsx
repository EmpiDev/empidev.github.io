"use client";
import React, { useState, useEffect } from 'react';

interface TodoItem {
    id: number;
    text: string;
    done: boolean;
}

export default function Todo() {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (newTodo.trim() === '') return;
        const newTodoItem: TodoItem = {
            id: Date.now(),
            text: newTodo,
            done: false,
        };
        setTodos([...todos, newTodoItem]);
        setNewTodo('');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Todo</h1>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new todo"
                        className="flex-1 p-2 border border-gray-300 rounded mr-2"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        Add
                    </button>
                </div>
                <ul className="list-none p-0">
                    {todos.map(todo => (
                        <li key={todo.id} className="flex justify-between items-center p-2 border-b border-gray-300">
                            <span
                                className={`flex-1 cursor-pointer ${todo.done ? 'line-through text-gray-500' : ''}`}
                                onClick={() => toggleTodo(todo.id)}
                            >
                                {todo.text}
                            </span>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}