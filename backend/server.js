const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(
    cors({
        origin: true,
    })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Cafe Street payment backend is running.",
    });
});

app.get("/api/payment/test", (req, res) => {
    res.json({
        message: "Paystack backend route is ready.",
        secretConfigured: Boolean(process.env.PAYSTACK_SECRET_KEY),
    });
});

app.post("/api/payment/initialize", async (req, res) => {
    try {
        const { email, amount, orderId } = req.body;

        if (!email || !amount || !orderId) {
            return res.status(400).json({
                message: "Email, amount and order ID are required.",
            });
        }

        const amountInKobo = Math.round(Number(amount) * 100);

        if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
            return res.status(400).json({
                message: "Invalid payment amount.",
            });
        }

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amountInKobo,
                metadata: {
                    orderId,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data.status) {
            return res.status(400).json({
                message:
                    response.data.message || "Payment initialization failed.",
            });
        }

        return res.json({
            authorizationUrl:
                response.data.data.authorization_url,
            accessCode: response.data.data.access_code,
            reference: response.data.data.reference,
        });
    } catch (error) {
        console.error(
            "Paystack error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Unable to initialize payment.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Cafe Street backend running on port ${PORT}`);
});