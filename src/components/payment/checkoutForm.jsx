import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

function PaymentStatusPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Payment Status</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white font-bold px-4 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function CheckoutForm({ dpmCheckerLink, groupId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/analytics/group?group_id=${groupId}`,
      },
      redirect: "if_required", // Prevent immediate redirection
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      setMessage(
        paymentIntent?.status === "succeeded"
          ? "Payment successful! Click 'Continue' to proceed."
          : "Payment processing. Please wait or click 'Continue' to proceed."
      );
    }

    setIsLoading(false);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Redirect the user after closing the pop-up
    window.location.href = `http://localhost:3000/analytics/group?group_id=${groupId}`;
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="w-1/2 mx-auto">
          <PaymentElement id="payment-element" options={paymentElementOptions} />
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="bg-purple-600 w-full rounded cursor-pointer mx-auto my-10 px-5 py-3 text-center block"
          >
            <p id="button-text" className="text-white font-bold">
              {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now $4.59"}
            </p>
          </button>
        </div>
      </form>

      {showPopup && <PaymentStatusPopup message={message} onClose={handleClosePopup} />}

      {/* [DEV]: Dynamic payment methods annotation */}
      {/* <div id="dpm-annotation">
        <p>
          Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
          <a href={dpmCheckerLink} target="_blank" rel="noopener noreferrer" id="dpm-integration-checker">Preview payment methods by transaction</a>
        </p>
      </div> */}
    </>
  );
}
