import React, { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import axios from 'axios';
import './style.css';

//loome kontekst, et jagada ülesannete data komponentide vahel
const TaskContext = createContext();

//haldame ülesannete olekut
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      //lisame uue ülesande
      return [...state, action.payload];
    case 'TOGGLE_TASK':
      //märgime ülesande lõpetatuks
      return state.map(task => task.id === action.payload ? { ...task, completed: !task.completed } : task);
    case 'REMOVE_TASK':
      //eemaldame ülesande
      return state.filter(task => task.id !== action.payload);
    case 'SET_TASKS':
      //seame algsed ülesanded
      return action.payload;
    default:
      //tagastame algse oleku, kui tegevus ei vasta ühele ülaltoodud
      return state;
  }
};

//komponent ülesannete loendi kuvamiseks
const TaskList = () => {
  //kasutame konteksti, et saada ligipääs konteksti andmetele
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

//komponent ülesannete haldamiseks
const TaskManager = () => {
  //kasutame useReducer hooki, et hallata ülesannete olekut
  const [state, dispatch] = useReducer(taskReducer, []);
  //kasutame useRef hooki, et saada ligipääs sisendi elemendile
  const inputRef = useRef();

  useEffect(() => {
    //laadime ülesanded serverist
    import('axios').then(({ default: axios }) => {
      //saame andmed serverist ja salvestame need olekusse
      axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
        .then(response => dispatch({ type: 'SET_TASKS', payload: response.data.map(task => ({ id: task.id, text: task.title, completed: task.completed })) }));
    });
  }, []);

  const addTask = () => {
    const text = inputRef.current.value;
    if (text) {
      dispatch({ type: 'ADD_TASK', payload: { id: Date.now(), text, completed: false } });
      //tühjendame sisestusvälja
      inputRef.current.value = '';
    }
  };

  return (
    //pakume konteksti, et jagada ülesannete olekut ja dispath funktsiooni
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

//peamine app komponent
const App = () => (
  <div>
    <TaskManager />
  </div>
);

export default App;