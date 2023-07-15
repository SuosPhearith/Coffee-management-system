
const mysql = require("../config/db")
const db = mysql()
const isNull = require("../service/isNullOrEmpty")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret_key = "KFE@3&FKS89^HSKESGJIEG24DF";
const getList = (req,res) =>{
    const text_search = req.query.text_search;
    let getListSql = "SELECT * FROM users";
    if(text_search!=""){
        getListSql+= " where Name LIKE '%" + text_search + "%'";
    }
    db.query(getListSql,(error,rows)=>{
        if(error){
            res.json({
                error : true,
                message : error
            })
            return
        }else{
            res.json({
                data : rows
            })
        }
    })
}
const create = (req,res) =>{
    const body = req.body;
    const name = body.Name;
    const username = body.Username;
    const password = body.Password;
    const role = body.Role;
    let bcrypt_pass = bcrypt.hashSync(password,15);

    let myfile = null;
    if(!isNull(req.file)){
        myfile = req.file.filename
    }
    const dataInput = [name,username,bcrypt_pass,myfile,role];

    if(isNull(name) || isNull(username) || isNull(password) || isNull(role) ){
        return res.json({
            message : "Pleaes input all fields!"
        })
        
    }
    const sql = "SELECT * FROM users WHERE Username = ?";
    db.query(sql,username,(error,rows)=>{
        if(error){
            return res.json({
                error : true,
                message : error
            })
        }
        if(!rows.length==0){
            res.json({
                message : "Username is exist!!"
            })
            return 
        }
        let sqlInsert = "INSERT INTO `users`(`Name`, `Username`, `Password`, `Image`, `Role`) VALUES (?,?,?,?,?)";
        db.query(sqlInsert,dataInput,(error,rows)=>{
            if(error){
                return res.json({
                    error : true,
                    message : error
                })
            }
            return res.json({
                message : "Insert success!!",
                data : rows
            })
        })
    })


    
}
const update = (req,res) =>{
    const body = req.body;
    const name = body.Name;
    const username = body.Username;
    const password = body.Password;
    const role = body.Role;
    const userID = body.UserID;
    const bcrypt_pass = bcrypt.hashSync(password,10);
    let myfile = body.file;
    if(!isNull(req.file)){
        myfile = req.file.filename;
    }
    
    const dataInput = [name,username,bcrypt_pass,myfile,role,userID];

    if(isNull(name) || isNull(username) || isNull(password) || isNull(role) || isNull(userID)){
        res.json({
            message : "Pleaes input all fields!"
        })
        return
    }else{
        let updateSql = "UPDATE users SET Name = ?, Username = ?, Password = ?, Image = ? , Role = ? WHERE UserID = ?"
        db.query(updateSql,dataInput,(error,rows)=>{
            if(error){
                res.json({
                    error : true,
                    message : error
                })
                return
            }else if(rows.affectedRows === 0){
                res.json({
                    message : "UserID not found!"
                })
            }else{
                res.json({
                    message : "Update successfully!",
                    data : rows
                })
            }
        })
    }
}
const remove = (req,res) =>{
    const UserID  = req.params.UserID;
    if(UserID == '10'){
        return res.json({
            message : "Cannot delete super admin account!!"
        })
    }
    if(isNull(UserID)){
        res.json({
            message : "Please input UserID!"
        })
        return
    }else{
        let deleteSql = "DELETE FROM users WHERE UserID = ?";
        db.query(deleteSql,UserID,(error,rows)=>{
            if(error){
                res.json({
                    error : true,
                    message : error
                })
                return
            }

            if(rows.affectedRows === 0){
                res.json({
                    message : "UserID not found!"
                })
            }else{
                res.json({
                    message : "Delete successfully!",
                    data : rows
                })
            }
        }) 
    }
}

const login = (req,res) =>{
    const {username,password} = req.body;
    
    if(isNull(username) || isNull(password)){
        return res.json({
            message : "Please input all fields!!"
        })
    }
    let sql = "SELECT * FROM users WHERE Username = ?";
    db.query(sql,username,(error,rows)=>{
        if(error){
            return res.json({
                error : true,
                message : error
            })
        }
        if(rows.length==0){
            return res.json({
                message : "Username does not exist!!"
            })
        }
        let data = rows[0];
        let passwordInDB = data.Password;
        let comparePassword = bcrypt.compareSync(password,passwordInDB)
        if(comparePassword){
            delete data.Password;
            let token = jwt.sign({profile:data},secret_key)
            return res.json({
                login : true,
                message : "Login success",
                data : data,
                token : token
            })
        }else{
            return res.json({
                message : "Incorrect password"
            })
        }
        
    })
    
}

const resetPassword = (req,res) =>{
    const body = req.body;
    const userID = body.UserID;
    const newPassword = body.newPassword;
    const confirmNewPassword = body.confirmNewPassword;
    if(isNull(newPassword) || isNull(confirmNewPassword) || isNull(userID)){
        return res.json({
            message : "Please inupt all fields!"
        })
    }
    if(newPassword != confirmNewPassword){
        return res.json({
            message : "Check you confirm password!"
        })
    }
    const bcrypt_password = bcrypt.hashSync(newPassword,10);
    let sql = "UPDATE users SET Password = ?WHERE UserID = ?"
    db.query(sql,[bcrypt_password,userID],(error,rows)=>{
        if(error){
            return res.json({
                error : true,
                message : error
            })
        }
        if(rows){
            return res.json({
                message : "Updated success!!",
                data: rows
            })
        }
    })
}

module.exports = {
    resetPassword,
    getList,
    create,
    update,
    remove,
    login
}