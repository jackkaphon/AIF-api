const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const db = require('../modules/db')
const dotenv = require('dotenv');
const bcrypt = require("bcrypt")

dotenv.config();

function verifyToken(token) {
    let decoded = ""
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            decoded = err
        } else {
            decoded = data
        }
    })

    return decoded
}

app.post('/getUser', async (req, res) => {
    try {
        const {token} = req.body

        const verify = verifyToken(token)

        if(verify.user_id){
            const params = [verify.user_id]
            const user = await db.fetch('SELECT id, email, username FROM user WHERE id = ? ', params)

            if(user.length > 0){
                res.status(200).send(user)
            }else{
                res.status(404).send('User not found')
            }
        }else{
            res.status(400).send(verify)
        }
    } catch (err) {
        console.log(err);
    }
})

app.put('/updateUser', async (req, res) => {
    try {
        const {token, username, email, password} = req.body

        const verify = verifyToken(token)

        if(verify.user_id){
            const encryptedPassword = await bcrypt.hash(String(password), 10);
            const params = [username, email, encryptedPassword, verify.user_id]

            const updateQuery = 'UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?'
            const updateUser = await db.update(updateQuery, params)

            if(updateUser.length > 0){
                res.status(200).send(updateUser)
            }else{
                res.status(400).send('Update Failed')
            }
        }else{
            res.status(400).send(verify)
        }
    } catch (err) {
        console.log(err);
    }
})

app.delete('/deleteUser', async (req, res) => {
    try {
        const {token} = req.body

        const verify = verifyToken(token)

        if(verify.user_id){
            const params = [verify.user_id]
            const deleteQuery = 'DELETE FROM user WHERE id = ?'

            const deleteUser = await db.del(deleteQuery, params)

            if(deleteUser.length > 0){
                res.status(200).send(deleteUser)
            }else{
                res.status(400).send('Delete Failed')
            }
        }else{
            res.status(400).send(verify)
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = app;