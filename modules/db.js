const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'aif'
})

connection.connect()

function fetch(query, params) {
    return new Promise((resolve, reject) =>{
        try{
            connection.query(query, params, function (err, result) {
                if (err){
                    return reject(err)
                }
                return resolve(result)
            });
        }
        catch(e){
            reject(e)
        }
    })
};

function insert(query, params) {
    return new Promise((resolve, reject) =>{
        try{
            connection.query(query, params, function (err, result) {
                if (err){
                    return reject(err)
                }
                return resolve(result)
            });
        }
        catch(e){
            reject(e)
        }
    })
};

function update(query, params) {
    return new Promise((resolve, reject) =>{
        try{
            connection.query(query, params, function (err, result) {
                if (err){
                    return reject(err)
                }
                return resolve('Update Successfully')
            });
        }
        catch(e){
            reject(e)
        }
    })
};

function del(query, params) {
    return new Promise((resolve, reject) =>{
        try{
            connection.query(query, params, function (err, result) {
                if (err){
                    return reject(err)
                }
                return resolve('Delete Successfully')
            });
        }
        catch(e){
            reject(e)
        }
    })
};

module.exports = {fetch, insert, update, del}