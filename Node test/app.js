const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {User, Todo} = require('./model');
const authentication = require('./authentication');

const app = express();

app.use(cors());
app.use(express.json())

async function connect() {
    await mongoose.connect('Your Cluster url');
    console.log("db connected")
}

connect().catch(e => console.log(e.message));

app.post('/user', async (req, res) => {
    
    try {
        const user = new User(req.body);
        const authToken = await user.generateAuthTokenAndSaveUser();
        res.send({user, authToken});
    } catch(e) {
        res.send(e.message)
    }
});

app.post('/user/login', async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        const authToken = await user.generateAuthTokenAndSaveUser();
        res.send({user, authToken});
    } catch(e) {
        res.send(e.message)
    }
})

app.post('/user/logout', authentication, async (req, res) => {
    try{
        req.user.authTokens = req.user.authTokens.filter(iten =>{
            return iten.authToken !== req.authToken;
        });

        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.send(e.message)
    }   
})

app.post('/user/logout/all', authentication, async (req, res) => {
    try{
        req.user.authTokens = [];
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.send(e.message)
    }
})

app.get('/all', authentication, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.send(e.message);
    }
    
});

app.get('/user/me', authentication, async (req, res) => {
    res.send(req.user);
});

app.patch('/user/update', authentication, async (req, res) => {
    try {
        const newInfo = Object.keys(req.body);
        newInfo.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.send(e.message)
    }
})

app.delete('/user/delete', authentication, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send('Your profile does not exist anymore')
    } catch(e) {
        res.send(e.message)
    }
});

app.post('/todo/new', authentication, async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text,
            user: req.user._id
        });
        await todo.save();
        res.send(todo);
    } catch(e) {
        res.send(e.message)
    }
});

app.get('/todo/all', authentication, async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user._id}).populate('user').exec();
        res.send(todos);
    } catch(e) {
        res.send(e.message)
    }
});

app.patch('/todo/update/:id', authentication, async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findOne({_id: todoId});
        todo.text = req.body.text;
        await todo.save();
        res.send(todo);
    } catch(e) {
        res.send(e.message)
    }
});

app.patch('/todo/complete/:id', authentication, async (req, res) => {
    try{
        const todoId = req.params.id;
        const todo = await Todo.findOne({_id: todoId});
        todo.isCompleted = !todo.isCompleted;
        await todo.save();
        res.send(todo);
    } catch(e) {
        res.send(e.message)
    }
});

app.delete('/todo/delete/:id', authentication, async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.deleteOne({_id: todoId});
        res.send(todo); 
    } catch(e) {
        res.send(e.message)
    }
})

app.listen('1000', () => {
    console.log("listening !!!");
})
