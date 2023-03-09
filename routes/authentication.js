const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const db = require('../modules/db')
const dotenv = require('dotenv');
const bcrypt = require("bcrypt")

dotenv.config();

function generateAccessToken(user_id) {
    return jwt.sign(user_id, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}

//test user
//email = jack@gmail.com
//password = 1234

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const params = [email]

        const user = await db.fetch('SELECT id, password FROM user WHERE email = ? ', params)

        if (user.length > 0) {
            const comparePassword = await bcrypt.compare(String(password), user[0].password)
            if (comparePassword) {
                const token = generateAccessToken({ user_id: user[0].id })
                res.status(200).send(token)
            } else {
                res.status(400).send('Wrong password')
            }
        } else {
            res.status(404).send('User does not exist')
        }
    }
    catch (err) {
        console.log(err);
    }
})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        const params = [email]

        const userExist = await db.fetch('SELECT id FROM user WHERE email = ?', params)

        if (userExist.length > 0) {
            res.status(409).send({
                message: 'This email is already exist'
            })
        } else {
            const encryptedPassword = await bcrypt.hash(String(password), 10);

            const params2 = [username, email, encryptedPassword]
            const createUserQuery = "INSERT INTO user(username, email, password) VALUES (?,?,?)"

            const createUser = await db.insert(createUserQuery, params2)

            const token = generateAccessToken({ user_id: createUser.insertId })
            res.status(200).send({
                token: token,
                message: "Register Successfully"
            })
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = app;