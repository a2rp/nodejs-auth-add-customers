const Customer = require("../models/customer.model");

module.exports.createNewCustomer = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length < 3) {
            return res.json({ success: false, message: "Invalid customer name; at least 3 chars required" });
        }
        const newCustomer = await Customer.create({ name, addedBy: req.user });
        console.log(newCustomer, "new");
        // const savedCustomer = await newCustomer.save();
        res.json({ success: true, message: "Customer created successfully.", customer: newCustomer });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

module.exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ addedBy: req.user });
        res.json({ success: true, message: "All customers fetched successfully", customers: { ...customers } });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

