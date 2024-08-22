const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
        validate(v) {
            if(!validator.isEmail(v)) {
                throw new Error('Your e-mail is not correct')
            };
        }
    },
    
    password: {
        type: String,
        require: true
    },

    authTokens : [
        {
            authToken: {
                type: String,
                require: true
            }
        }
    ]
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.authTokens;

    return user;
}

userSchema.methods.generateAuthTokenAndSaveUser = async function() {
    const authToken = jwt.sign({ _id: this._id.toString() }, 'private');
    this.authTokens.push({ authToken });
    await this.save();
    return authToken;
}

userSchema.statics.findUser = async (email, password) => {
    const user = await User.findOne({email: email});

    if(!user) {
        throw new Error('User not found');
    }

    const isRightPassword = await bcrypt.compare(password, user.password);

    if(!isRightPassword) {
        throw new Error('Your password is not correct, please try again');
    }

    return user
}

userSchema.pre('save', async function() {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

const todoSchema = new mongoose.Schema ({
    text: {
        type: String,
        require: true,
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

todoSchema.methods.toJSON = function() {
    const todo = this.toObject();
    // delete todo.isCompleted;
    delete todo.user;

    return todo;
}

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

module.exports = {User, Todo};