import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './component/login';
import Signup from './component/signup';
import Todo from './component/todo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/todo' element={<Todo />} />
      </Routes>
    </div>
  );
}

export default App;
