const stripe = Stripe('pk_test_51RCKBDCZE47lrPCPeYcXt9DwisbJSbgGbda6xS6QAyBJyq3j81vIYYvOeMhQKlY5P52M4AvrA6nvf15wBNWBjj9R006B2vAuXi'); // replace with your public key

let elements;

initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

async function initialize() {
  const response = await fetch("http://localhost:4242/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 5000, currency: "usd" }), // $50 default
  });

  const { clientSecret } = await response.json();

  elements = stripe.elements({ clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: "https://donerboxx.com/thank-you.html",
    },
  });

  if (error) {
    document.querySelector("#error-message").textContent = error.message;
  } else {
    document.querySelector("#error-message").textContent = "";
  }
}