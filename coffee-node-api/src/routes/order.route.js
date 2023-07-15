
const orderController = require('../controllers/order.controller')
const url = "/api/order/"
const order = (app) => {
   app.get(url + "getList",orderController.getList)
   app.get(url+ "getListDebt",orderController.getListDebt)
   app.get(url+ "getListPayAll",orderController.getListPayAll)
   app.get(url+ "getListInvoice",orderController.getListInvoice)
   app.get(url + "getListEachOrderProductPrice",orderController.getListEachOrderProductPrice)
   app.post(url + "create",orderController.create)
   app.put(url + "update",orderController.update)
   app.delete(url + "remove/:ID",orderController.remove)
   
}

module.exports = order









