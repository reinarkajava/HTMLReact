import React, { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import axios from 'axios';
import './style.css';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'TOGGLE_TASK':
      return state.map(task => task.id === action.payload ? { ...task, completed: !task.completed } : task);
    case 'REMOVE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'SET_TASKS':
      return action.payload;
    default:
      return state;
  }
};

const TaskList = () => {
  const { tasks, dispatch } = useContext(TaskContext);

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {task.text} 
            <button onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}>✓</button>
            <button onClick={() => dispatch({ type: 'REMOVE_TASK', payload: task.id })}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TaskManager = () => {
  const [state, dispatch] = useReducer(taskReducer, []);
  const inputRef = useRef();

  useEffect(() => {
    import('axios').then(({ default: axios }) => {
      axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
        .then(response => dispatch({ type: 'SET_TASKS', payload: response.data.map(task => ({ id: task.id, text: task.title, completed: task.completed })) }));
    });
  }, []);

  const addTask = () => {
    const text = inputRef.current.value;
    if (text) {
      dispatch({ type: 'ADD_TASK', payload: { id: Date.now(), text, completed: false } });
      inputRef.current.value = '';
    }
  };

  return (
    <TaskContext.Provider value={{ tasks: state, dispatch }}>
      <div>
        <h1><b>TASK MANAGER</b></h1>
        <input ref={inputRef} type="text" placeholder="Add a task" />
        <button onClick={addTask}>Add</button>
        <TaskList />
      </div>
    </TaskContext.Provider>
  );
};

const App = () => (
  <div>
    <TaskManager />
  </div>
);

export default App;