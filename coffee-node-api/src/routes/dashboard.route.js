const url = '/api/dashboard/';
const dashboardController = require("../controllers/dashboard.contrller")
const dashboard = (app) =>{
    app.get(url + "getListProductAnalysis", dashboardController.getListProductAnalysis)
    app.get(url + "getListUserAnalysis", dashboardController.getListUserAnalysis)
    app.get(url + "getListOrders", dashboardController.getListOrders)
    app.get(url + "getListSaleItem", dashboardController.getListSaleItem)
    app.get(url + "getListItem", dashboardController.getListItem)
    app.get(url + "getListIncome", dashboardController.getListIncome)
    app.get(url + "getListIncomeDataToDate", dashboardController.getListIncomeDataToDate)
    app.get(url + "getListAdmin", dashboardController.getListAdmin)
    app.get(url + "getListEmployee", dashboardController.getListEmployee)
    app.get(url + "getListIncomeFromDateToDate", dashboardController.getListIncomeFromDateToDate)
    app.get(url + "getListSaleItemDateToDate", dashboardController.getListSaleItemDateToDate)
}

module.exports = dashboard