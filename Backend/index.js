require("dotenv").config();
const path = require('path');
const fs = require('fs')
const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/UserRoutes");
const expenseRoute = require("./routes/ExpenseRoutes");
const orderRoutes = require("./routes/PurchaseRoutes");
const premiumRoutes = require('./routes/PremiumFeaturesRoutes')
const forgotPasswordRoutes = require('./routes/ForgotPassword');
const db = require("./utils/db");

const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan')

const expense = require("./models/ExpenseModel");
const user = require("./models/UserModel");
const Order = require("./models/OrderModel");
const ForgotPassword = require('./models/ForgotPasswordRequestsModel')
const DownloadURL = require('./models/DownloadUrl');

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/order", orderRoutes);
app.use("/premium",premiumRoutes)

app.use("/password",forgotPasswordRoutes)


const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(helmet());
app.use(compression())
app.use(morgan("combined",{stream:accessLogStream}))


/* User and Expense Association */
user.hasMany(expense, {
  foreignKey: "user_id",
  as: "expense",
});
expense.belongsTo(user, {
  foreignKey: "user_id",
  as: "user",
});

/* User and ForgotPassword Association */
user.hasMany(ForgotPassword);
ForgotPassword.belongsTo(user);

/* User and Order Association */
user.hasMany(Order);
Order.belongsTo(user);

/* User and Download Associations */
user.hasMany(DownloadURL);
DownloadURL.belongsTo(user);

const port  = process.env.PORT_NO || 3002;

db.sync()
  .then(() => {
    console.log("All the table synced successfully");
    app.listen(port, () => {
      console.log("App started on localhost",port);
    });
  })
  .catch((err) => console.log("Error in syncing the tables ", err));
