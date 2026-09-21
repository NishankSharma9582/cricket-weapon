import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../component/layouts/MataData/MataData";
import TermsImage from "../Image/about/tc.jpg";
import { PageShell } from "../ui/kit";
const ReturnPolicyPage = () => {
  return (
    <PageShell>
      <div className="legal mx-auto w-full max-w-5xl px-5 pb-16 pt-14">
      <MetaData title="Return Policy" />
      <div className="legal-banner glass-card">
        <img
          src={TermsImage}
          alt="Background"
        />
        <h1>RETURN POLICY</h1>
      </div>
      <div className="legal-body glass glass-card mt-8 p-6 sm:p-10">
        <p>
          Thank you for shopping with CricketWeapon! We want to ensure your
          satisfaction with every purchase. If you are not completely satisfied
          with your purchase, we offer a return policy of 30 days for most
          products and 7 days for select products.
        </p>
        <p>
          To be eligible for a return, the item must be unused, in its original
          packaging, and in the same condition as you received it. You will also
          need to provide proof of purchase. Please note that certain items,
          such as personalized or custom-made products, may not be eligible for
          return unless there is a defect or error on our part.
        </p>
        <p>
          If you would like to initiate a return, please contact our Customer
          Service Department within the specified return period. Our team will
          guide you through the return process and provide you with the
          necessary instructions and return address.
        </p>
        <p>
          Once we receive your returned item and verify its condition, we will
          process the refund to the original payment method used for the
          purchase. Please allow up to [number of days] for the refund to be
          reflected in your account.
        </p>
        <p>
          Please note that return shipping costs are the responsibility of the
          customer, unless the return is due to a defect or error on our part.
          We recommend using a trackable shipping method to ensure the safe and
          timely delivery of your return.
        </p>
        <p>
          If you have any questions or need further assistance regarding our
          return policy, please feel free to contact our Customer Service
          Department. We are here to help!
        </p>
        <h2>Contact Information:</h2>
        <p>
          Customer Service Department
          <br />
          <span style={{ fontWeight: "500" }}>Email </span>: 
          support@cricketweapon.com
          <br />
          <span style={{ fontWeight: "500" }}>Phone  </span>:  123-456-7890
          <br />
      <span style={{ fontWeight: "500" }}>    Hours of Operation: Monday to Friday, 9:00 AM to 5:00 PM (GMT) </span>
        </p>
        <p>
          Please reach out to us if you have any concerns or require any
          clarifications regarding our{" "}
          <Link
            to="/policy/return"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "500",
            }}
          >
            return policy
          </Link>
          . We strive to provide excellent customer service and ensure your
          satisfaction.
        </p>
      </div>
      </div>
    </PageShell>
  );
};

export default ReturnPolicyPage;
