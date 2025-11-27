import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/api/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  const fetchTasks = async () => {
  try {
    const res = await axios.get(API);
    const {tasks} =res.data
    console.log('API raw response:',tasks);
    

    const data = res.data;
    let nextTasks = [];

    if (Array.isArray(data)) {
      nextTasks = data;
    } else if (data && Array.isArray(data.tasks)) {
      nextTasks = data.tasks;
    } else if (data && Array.isArray(data.data)) {
      nextTasks = data.data;
    } else {
      console.error('Unexpected tasks format, using []:', data);
    }

    console.log('Setting tasks to:', nextTasks);
    setTasks(nextTasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    setTasks([]);
  }
};

  const addTask = async () => {
    if (!text) return;
    try {
      await axios.post(API, { text });
      setText('');
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  console.log('Current tasks in state:', tasks, 'isArray:', Array.isArray(tasks));

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Do List with Devops DB Test</h1>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {(Array.isArray(tasks) ? tasks : []).map(task => (
          <li key={task._id}>
            {task.text}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
