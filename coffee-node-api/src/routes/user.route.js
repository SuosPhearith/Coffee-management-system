
const userController = require("../controllers/user.controller")
const url = "/api/user/"
const upload = require("../config/upload")
const user = (app) =>{
    app.get(url + "getList",userController.getList)
    app.post(url + "create",upload.single('file'),userController.create)
    app.post(url + "login",upload.single('file'),userController.login)
    app.put(url + "update",upload.single('file'),userController.update)
    app.put(url+"resetPassword",userController.resetPassword)
    app.delete(url + "remove/:UserID",userController.remove)
}

module.exports = user