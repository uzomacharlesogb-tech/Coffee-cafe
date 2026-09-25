const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const axios = require("axios");

const PAYSTACK_SECRET_KEY = defineSecret("PAYSTACK_SECRET_KEY");

exports.initializePayment = onCall(
    {
        secrets: [PAYSTACK_SECRET_KEY],
    },
    async (request) => {
        // Make sure the customer is logged in
        if (!request.auth) {
            throw new HttpsError(
                "unauthenticated",
                "You must be logged in to make a payment."
            );
        }

        const { email, amount, orderId } = request.data;

        // Validate required information
        if (!email || !amount || !orderId) {
            throw new HttpsError(
                "invalid-argument",
                "Email, amount, and order ID are required."
            );
        }

        // Paystack expects the amount in kobo
        const amountInKobo = Math.round(Number(amount) * 100);

        if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
            throw new HttpsError(
                "invalid-argument",
                "Invalid payment amount."
            );
        }

        try {
            const response = await axios.post(
                "https://api.paystack.co/transaction/initialize",
                {
                    email,
                    amount: amountInKobo,
                    metadata: {
                        orderId,
                        userId: request.auth.uid,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY.value()}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.status) {
                throw new Error(
                    response.data.message || "Payment initialization failed."
                );
            }

            return {
                authorizationUrl: response.data.data.authorization_url,
                accessCode: response.data.data.access_code,
                reference: response.data.data.reference,
            };
        } catch (error) {
            console.error(
                "Paystack initialization error:",
                error.response?.data || error.message
            );

            throw new HttpsError(
                "internal",
                "Unable to initialize payment."
            );
        }
    }
);