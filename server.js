const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const knex = require('knex');

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const profile = require('./controllers/profile')

//Connect postgres
const db = require('knex')({
    client: 'pg',
    connection: "postgres://postgres:Thebahamas1@127.0.0.1:5432/smart-brain",
    searchPath: ['knex', 'public'],
});

//Middleware for express
const app = express()
app.use(express.json());
app.use(cors())

//Sign In endpoint
app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) })

//Register endpoint
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

//Get profile endpoint
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) }) 

//Update entry count endpoint
app.put('/image', (req, res) => { profile.handleImage(req, res, db) })

//Clarifai api call
app.post('/imageurl', (req, res) => { profile.handleApiCall(req, res) })

app.listen(3000, ()=> {
    console.log("App is running on port 3000")
})