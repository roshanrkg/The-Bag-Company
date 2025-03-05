const express = require("express");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const router = express.Router();

router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: "order_rcpt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.json({ success: true, message: "Payment verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }
});

module.exports = router;
