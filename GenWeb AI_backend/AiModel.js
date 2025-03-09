require("dotenv").config();

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const CodegenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
 
     const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });

    const GenAiCode = model.startChat({
      generationConfig:CodegenerationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "generate todo app: Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"projectTitle\": \"React Todo App with Tailwind CSS\",\n  \"explanation\": \"This React project creates a Todo application using Tailwind CSS for styling. It's structured into components for organization and uses Lucide React icons for visual elements. The application provides a clean and functional interface for managing tasks, allowing users to add, delete, and mark tasks as complete.The project focuses on utilizing React's component-based architecture and Tailwind CSS's utility-first approach for efficient development and customization, emphasizing a visually appealing and user-friendly experience with emoji icons for improved UX.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\nimport TodoList from './components/TodoList';\\nimport TodoForm from './components/TodoForm';\\nimport { Clock } from 'lucide-react';\\nimport { format } from 'date-fns';\\n\\nfunction App() {\\n  const [todos, setTodos] = useState(() => {\\n    const storedTodos = localStorage.getItem('todos');\\n    return storedTodos ? JSON.parse(storedTodos) : [];\\n  });\\n  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));\\n\\n  useEffect(() => {\\n    localStorage.setItem('todos', JSON.stringify(todos));\\n  }, [todos]);\\n\\n  useEffect(() => {\\n    const intervalId = setInterval(() => {\\n      setCurrentTime(format(new Date(), 'HH:mm:ss'));\\n    }, 1000);\\n\\n    return () => clearInterval(intervalId);\\n  }, []);\\n\\n  const addTodo = (text) => {\\n    setTodos([...todos, { id: Date.now(), text, completed: false }]);\\n  };\\n\\n  const deleteTodo = (id) => {\\n    setTodos(todos.filter((todo) => todo.id !== id));\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTodos(\\n      todos.map((todo) =>\\n        todo.id === id ? { ...todo, completed: !todo.completed } : todo\\n      )\\n    );\\n  };\\n\\n  return (\\n    <div className=\\\"bg-gray-100 min-h-screen py-10\\\">\\n      <div className=\\\"container mx-auto p-4\\\">\\n        <h1 className=\\\"text-3xl font-bold text-center text-gray-800 mb-6\\\">\\n          My Todo List 📝\\n        </h1>\\n        <div className=\\\"flex justify-center items-center mb-4\\\">\\n          <Clock className=\\\"mr-2 text-gray-600\\\" />\\n          <span className=\\\"text-gray-600\\\">{currentTime}</span>\\n        </div>\\n        <TodoForm addTodo={addTodo} />\\n        <TodoList\\n          todos={todos}\\n          deleteTodo={deleteTodo}\\n          toggleComplete={toggleComplete}\\n        />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\\n\"\n    },\n    \"/components/TodoForm.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nfunction TodoForm({ addTodo }) {\\n  const [text, setText] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (text.trim() !== '') {\\n      addTodo(text);\\n      setText('');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"mb-4 flex\\\">\\n      <input\\n        type=\\\"text\\\"\\n        className=\\\"shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full mr-2\\\"\\n        placeholder=\\\"Add a new todo...\\\"\\n        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n      />\\n      <button\\n        type=\\\"submit\\\"\\n        className=\\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\"\\n      >\\n        <Plus className=\\\"h-5 w-5\\\" />\\n      </button>\\n    </form>\\n  );\\n}\\n\\nexport default TodoForm;\\n\"\n    },\n    \"/components/TodoList.js\": {\n      \"code\": \"import React from 'react';\\nimport { Trash, Check } from 'lucide-react';\\n\\nfunction TodoList({ todos, deleteTodo, toggleComplete }) {\\n  return (\\n    <ul>\\n      {todos.map((todo) => (\\n        <li\\n          key={todo.id}\\n          className=\\\"bg-white shadow-md rounded-md p-4 mb-2 flex items-center justify-between\\\"\\n        >\\n          <div className=\\\"flex items-center\\\">\\n            <input\\n              type=\\\"checkbox\\\"\\n              className=\\\"mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500\\\"\\n              checked={todo.completed}\\n              onChange={() => toggleComplete(todo.id)}\\n            />\\n            <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>\\n              {todo.text}\\n            </span>\\n          </div>\\n          <div>\\n            <button\\n              className=\\\"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2\\\"\\n              onClick={() => deleteTodo(todo.id)}\\n            >\\n              <Trash className=\\\"h-5 w-5\\\" />\\n            </button>\\n          </div>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TodoList;\\n\"\n    }\n  },\n  \"generatedFiles\": [\n    \"/App.js\",\n    \"/components/TodoForm.js\",\n    \"/components/TodoList.js\"\n  ]\n}\n```"},
          ],
        },
      ],
    })

    module.exports = {chatSession,GenAiCode};