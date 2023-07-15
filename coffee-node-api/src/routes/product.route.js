
const productController = require("../controllers/product.controller")
const url = "/api/product/"
const upload = require("../config/upload")
const product = (app) => {
   app.get(url + "getList",productController.getList)
   app.post(url + "insert",upload.single('file'),productController.insert)
   app.put(url + "update",upload.single('file'),productController.update)
   app.delete(url + "remove/:ID",productController.remove)
}

module.exports = product
