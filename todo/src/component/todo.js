import React from "react";
import '../styles/todo.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare, faRightFromBracket, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editText, setEditText] = useState('');
    const [id, setId] = useState('');
    const [countComplete, setCountComplte] = useState(0);
    const [view, setView] = useState(false);
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({
        _id: '',
        name: '',
        email: ''
    })

    useEffect(() => {
        getTodos();
        getUserInfo();
    }, []);

    useEffect(() => {
        setCountComplte(todos.filter(todo => todo.isCompleted === true).length);
    }, [todos])

    const getTodos = () => {
        fetch('http://localhost:1000/todo/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        }).then(res => res.json()).then(data => setTodos(data));
    }

    const getUserInfo = () => {
        fetch('http://localhost:1000/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        }).then(res => res.json()).then(data => setUserInfo(data));
    }

    const addTodo = async () => {
        const data = await fetch('http://localhost:1000/todo/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({
                text
            })
        }).then(res => res.json());

        if(data) {
            setTodos([...todos, data]);
            setText('');
        }
    }

    const editTodo = async (id) => {
        const data = await fetch('http://localhost:1000/todo/update/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                "text": editText
            })
        }).then(res => res.json());

        if(data) {
            setTodos(prev => prev.map((todo) => {
                if(todo._id === data._id) {
                    todo.text = data.text
                }
                return todo;
            }))
        }

        setShow(false);
    }

    const deleteTodo = async (id) => {
        const data = await fetch(`http://localhost:1000/todo/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json());

        if(data) {
            setTodos(prev => prev.filter(todo => todo._id !== id))
        }
    }

    const completeTodo = async (id) => {
        const data = await fetch(`http://localhost:1000/todo/complete/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json());

        if(data) {
            setTodos(prev => prev.map(todo => {
                if(todo._id === data._id) {
                    todo.isCompleted = data.isCompleted;
                }

                return todo;
            }))
        }
    }

    const logout = async () => { // requête back
        const data = await fetch('http://localhost:1000/user/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json());
        
        if(data){
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            alert('Impossible')
        }
        
    }

    const handleOnclick = (text, id) => {
        setShow(!show);
        setEditText(text);
        setId(id);
    } 

    return (
        <div className="todo">
            <nav className="navbar">
                <Link to='/todo'>Todo</Link>
                <div>
                    <FontAwesomeIcon className="user" icon={faUser} onClick={() => setView(!view)} />
                    <FontAwesomeIcon className="user" icon={faRightFromBracket} onClick={() => logout()} />
                </div>   
            </nav>

            <div className={view ? "info view" : "info"}>
                <div className="welcome">
                    <p>Hello, {userInfo.name}!</p>
                </div>
                <div className="detail">
                    <span>Name</span>
                    <p>{userInfo.name}</p>
                    <span>Email</span>
                    <p>{userInfo.email}</p>
                </div>
            </div>
            
            <div className="container">
                <div className="stat">
                    <div className="text">
                        <h3>Todo Done</h3>
                        <p>Keep it up</p>
                    </div>
                    <div className="number-complete">
                        <p>{countComplete}/{todos.length}</p>
                    </div>
                </div>
                <div className="add">
                    <input type="text" placeholder="Write your next task" value={text} onChange={e => setText(e.target.value)} />
                    <button onClick={ () => addTodo()}>+</button>
                </div>
                
                <div className={ show ? "edit edit-show" : "edit"}>
                    <FontAwesomeIcon icon={faXmark} className="close" onClick={() => setShow(false)} />
                    <div className="add">
                        <input type="text" placeholder="Write your next task" value={editText} onChange={e => setEditText(e.target.value)} />
                        <button onClick={ () => editTodo(id)}>+</button>
                    </div>
                </div>

                {
                    todos.length > 0 ? todos.map(todo => (
                        <div key={todo._id} className="task">
                            <div className="group">
                                <div onClick={() => completeTodo(todo._id)} className={todo.isCompleted ? "complete" : "circle"}></div>
                                <p>{todo.text}</p>
                            </div>
                            <div className="group">
                                <FontAwesomeIcon icon={faPenToSquare} className="btn" onClick={() => handleOnclick(todo.text, todo._id)} />
                                <FontAwesomeIcon icon={faTrash} className="btn" onClick={() => deleteTodo(todo._id)} />
                            </div>
                        </div>
                    )) :  <p className="no-task">You have no task</p>                    
                }    
            </div>
        </div>
    );
}

export default Todo;