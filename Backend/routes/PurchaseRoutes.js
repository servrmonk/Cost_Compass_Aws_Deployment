const express = require("express");
const router = express.Router();

const userAuthenticate = require("./Auth");
const {
  purchasepremium,
  updateTransactionStatus,
} = require("../controllers/PurchaseController");

router.get(
  "/premiummembership",
  userAuthenticate.authenticate,
  purchasepremium
);
router.post(
  "/updatetransactionstatus",
  userAuthenticate.authenticate,
  updateTransactionStatus
);

module.exports = router;
