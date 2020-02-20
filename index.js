var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
 
var mysql = require('mysql');
 
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expresscrud2api'
});
// connect to database
dbConn.connect(); 
 
// default route
//www.domain.com
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
// Retrieve all users 
app.get('/allusers', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Complete Data.' });
    });
});
// Retrieve user with id 
app.get('/user/:id', function (req, res) {
  
    let id = req.params.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide id' });
    }
  
    dbConn.query('SELECT * FROM users where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Information by ID.' });
    });
  
});
 
// Add a new Record
app.post('/adduser', function (req, res) {
  
    let name = req.body.name;
    let email = req.body.email;
//   console.log(name+" "+email);
    if (!name && !email) {
        return res.status(400).send({ error:true, message: 'Please provide Information to be add' });
    }
  
    dbConn.query("INSERT INTO users(name, email) value(?,?) ", [name,email], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Record has been added' });
    });
});
 
//  Update user with id
app.put('/update', function (req, res) {
  
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    if (!id || !name || !email) {
        return res.status(400).send({ error: user, message: 'Please provide full information with id' });
    }
  
    dbConn.query("UPDATE users SET name = ?, email= ? WHERE id = ?", [name, email, id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'data updated' });
    });
});
 
//  Delete user
app.delete('/deleteuser', function (req, res) {
  
    let id = req.body.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User Data has been deleted' });
    });
}); 
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;