// At the very top of your main entry file
// require("dotenv").config();

const Razorpay = require("razorpay");
const Order = require("../models/OrderModel");

const purchasepremium = async (req, res) => {
  // console.log("process.env.RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID);
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders
      .create({ amount, currency: "INR" }, (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        req.user
          .createOrder({ orderid: order.id, status: "PENDING" })
          .then(() => res.status(201).json({ order, key_id: rzp.key_id }));
        // console.log("Order in rzp.orders ", order);
      })
      .catch((err) => {
        console.log("error incatch  block", err);
        throw new Error(err);
      });
  } catch (err) {
    console.log("error incatch  block", err);
    res.status(403).json({ message: "Something went wrong", error: err });
    throw new Error(err);
  }
};
const updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    // Find the order by order_id
    // instead of using simple await we will use promise.all all the promise will be succeed
    const order = await Order.findOne({ where: { orderid: order_id } });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const promise1 = await order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = await req.user.update({ premium: true });

    Promise.all([promise1, promise2]) //OPTIMIZED
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Transaction Successful" });
      })
      .catch((err) => {
        throw new Error(err);
      });

    // return res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.log("Error in updateTransactionStatus", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in transaction updation",
      error: err.message,
    });
  }
};

module.exports = { purchasepremium, updateTransactionStatus };
