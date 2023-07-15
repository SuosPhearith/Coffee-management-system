
const mysql = require("../config/db")
const db = mysql()

const getListOrders = (req,res) =>{
    let sql = "SELECT COUNT(OrderID) as totalOrder FROM orders";
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListSaleItem = (req,res) =>{
    let sql = "SELECT SUM(Quantity) as totalOrderItem FROM orderitems"
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListItem = (req,res) =>{
    let sql = "SELECT COUNT(ProductID) as AllItems FROM products"
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListIncome = (req,res) =>{
    let sql = "SELECT SUM(PaymentAmount) as income FROM payments"
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListIncomeDataToDate = (req,res) =>{
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    let sql = "SELECT SUM(PaymentAmount) as income FROM payments pm JOIN orders o ON pm.OrderID = o.OrderID"
    if(startDate||endDate){
        sql+= "  WHERE o.OrderDate BETWEEN '"+ startDate + "' AND '"+ endDate + "'";
    }
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListAdmin = (req,res) =>{
    let sql = "SELECT COUNT(UserID) as admin FROM users WHERE Role = 'admin'"
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListEmployee = (req,res) =>{
    let sql = "SELECT COUNT(UserID) as employee FROM users WHERE Role = 'employee'"
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListProductAnalysis = (req,res) =>{
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    // return res.json({
    //     startDate : startDate,
    //     endDate : endDate
    // })
    let sql = "SELECT p.ProductID, p.Name, p.Price, p.Description, p.Image, SUM(oi.Quantity) as totalQuantitiy, SUM(oi.TotalPrice) as totalPrice"
    + " FROM orderitems oi"
    + " JOIN orders o ON oi.OrderID = o.OrderID"
    + " JOIN products p ON oi.ProductID = p.ProductID"
    if(startDate || endDate ){
        sql+= " WHERE o.OrderDate BETWEEN '" + startDate + "' AND '"+ endDate + "'"
    }
    sql+=" GROUP BY p.ProductID, p.Name, p.Price, p.Description"
    + " ORDER BY SUM(oi.Quantity) DESC;"

    // return res.json({
    //     sql : sql
    // })
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListUserAnalysis = (req,res) =>{
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    let sql = "SELECT u.Name, u.Username,u.Image,u.Role, SUM(oi.Quantity) TotalSaleItems FROM users u JOIN orders o ON u.UserID = o.UserID JOIN orderitems oi ON o.OrderID = oi.OrderID"
    if(startDate||endDate){
        sql+=" WHERE o.OrderDate BETWEEN '" + startDate + "' AND '" + endDate + "'" 
    }
    sql+=" GROUP BY o.UserID;"
    // return res.json({
    //     sql : sql
    // })
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}

const getListIncomeFromDateToDate = (req,res) =>{
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    let sql = "SELECT SUM(oi.TotalPrice) as TotalPrice FROM orderitems oi JOIN orders o ON oi.OrderID = o.OrderID";
    if(startDate||endDate){
        sql += " WHERE o.OrderDate BETWEEN '"+ startDate+"' AND '"+ endDate +"'"
    }
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
    
}

const getListSaleItemDateToDate = (req,res) =>{
    let startDate = req.query.start_date;
    let endDate = req.query.end_date;
    let sql = "SELECT SUM(oi.Quantity) as TotalItemOrder FROM orderitems oi JOIN orders o ON oi.OrderID = o.OrderID" 
    if(startDate||endDate){
        sql += " WHERE o.OrderDate BETWEEN '"+ startDate+"' AND '"+ endDate +"'"
    }
    db.query(sql,(error,rows)=>{
        if(error){
            return res.json({
                error : true ,
                message : error
            })
        }
        res.json({
            data : rows
        })
    })
}



module.exports = {
    getListOrders,
    getListSaleItem,
    getListItem,
    getListIncome,
    getListIncomeDataToDate,
    getListAdmin,
    getListEmployee,
    getListIncomeFromDateToDate,
    getListSaleItemDateToDate,
    getListProductAnalysis,
    getListUserAnalysis
}

