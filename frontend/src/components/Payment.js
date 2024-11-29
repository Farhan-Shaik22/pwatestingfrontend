'use client'
import { useState } from "react";

const RazorpayPayment = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }

    setLoading(true);

    // Make API call to backend to create an order
    try {
      const response = await fetch("http://localhost:3000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency }),
      });

      const order = await response.json();

      if (response.ok) {
        // Configure Razorpay options
        const options = {
          key: process.env.YOUR_RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
          amount: order.amount,
          currency: order.currency,
          name: "Your Company Name",
          description: "Test Transaction",
          image: "/your-logo.png", // Add your logo here
          order_id: order.id,
          handler: (response) => {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          },
          prefill: {
            name: "Your Customer Name",
            email: "customer@example.com",
            contact: "1234567890",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (response) {
          alert(`Payment failed: ${response.error.description}`);
        });
      } else {
        alert("Failed to create Razorpay order. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Razorpay Payment</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Amount (in ₹):{" "}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: "5px", width: "100%" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Currency:{" "}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ padding: "5px", width: "100%" }}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#3399cc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default RazorpayPayment;
