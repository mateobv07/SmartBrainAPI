const express = require('express');
const cors = require('cors')
const bcrypt = require('bcryptjs');

const register = require('./controllers/register')
const signIn = require('./controllers/signIn')
const profile = require('./controllers/profile')

//Connect postgres
const db = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: true,
    searchPath: ['knex', 'public'],
});

//Middleware for express
const app = express()
app.use(express.json()); 
app.use(cors())

//
app.get('/', (req, res) => { res.send('working...')})

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


app.listen(process.env.PORT || 3000, ()=> {
    console.log(`App is running on port`);
})