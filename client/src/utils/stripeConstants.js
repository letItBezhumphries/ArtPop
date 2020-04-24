export const CURRENCY = "usd";

export const PAYMENT_SERVER_URL = process.env.PAYMENT_SERVER_URL;

export const STRIPE_PUBLISHABLE = process.env.STRIPE_PUBLISHABLE;

export const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "20px",
      color: "#424770",
      letterSpacing: "0.055em",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#9e2146"
    }
  }
};

export const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883"
      },
      "::placeholder": {
        color: "#87BBFD"
      }
    },
    invalid: {
      iconColor: "#FFC7EE",
      color: "#FFC7EE"
    }
  }
};

export const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto"
    }
  ]
};
