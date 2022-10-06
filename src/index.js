const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find((user) => user.username === username)

  if (!user) {
    return response.status(400).json({ error: "User does't exists" })
  }

  request.useres = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
  const usernameAlredyInUse = users.some(
    (user) => user.username === username
  )

  if (usernameAlredyInUse) {
    return response.status(400).json({ error: "This username is in use alredy" })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  response.status(201).json({ users })

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request

  const user = users.find(user => users.username === username)

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const userTask = { 
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  return response.json(userTask)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body

  const editTask = {
    title,
    deadline: new Date(deadline)
  }

  return response.json(editTask)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const editTaskState = {
    done: true
  }

  return response.json(editTaskState)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

module.exports = app;