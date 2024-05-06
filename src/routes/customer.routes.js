const router = require("express").Router();
const { getAllCustomers, createNewCustomer } = require("../controllers/customer.controllers");
const auth = require("../middlewares/auth");

router.post("/add", auth, createNewCustomer);
router.get("/all", auth, getAllCustomers);

module.exports = router;

