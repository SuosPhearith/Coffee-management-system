const express = require("express")
const bodyParser = require('body-parser');
const app = express()
const cors = require("cors")
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin : "*"}))



require("./src/routes/product.route")(app)
require("./src/routes/user.route")(app)
require("./src/routes/order.route")(app)
require("./src/routes/dashboard.route")(app)


const port = 8080
app.listen(port,()=>{
    console.log("http://localhost:" + port)
})