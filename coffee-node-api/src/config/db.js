
const mysql = require('mysql')

const db = () =>{
    const connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'coffee_db'
    });
    connection.connect((err)=>{
        if(err){
            console.log('Error connecting to the database:', err)
            return
        }
    });
    return connection;
}

module.exports = db