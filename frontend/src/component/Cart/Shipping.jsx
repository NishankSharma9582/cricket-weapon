import React from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, MapPin, Phone, Mail, CreditCard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layouts/MataData/MataData";
import CheckoutSteps from "./CheckoutSteps ";
import { PageShell, fadeUp } from "../../ui/kit";

const Shipping = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = React.useState(shippingInfo.address || "");
  const [firstName, setFirstName] = React.useState(shippingInfo.firstName || "");
  const [lastName, setLastName] = React.useState(shippingInfo.lastName || "");
  const [city, setCity] = React.useState(shippingInfo.city || "");
  const [pinCode, setPinCode] = React.useState(shippingInfo.pinCode || "");
  const [state, setState] = React.useState(shippingInfo.state || "");
  const [country, setCountry] = React.useState(shippingInfo.country || "India");
  const [phoneNo, setPhone] = React.useState(shippingInfo.phoneNo || "");
  const [email, setEmail] = React.useState(shippingInfo.email || "");
  const [saveAddress, setSaveAddress] = React.useState(false);
  const [sameBillingDelivery, setSameBillingDelivery] = React.useState(false);
  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const [isPhoneNoValid, setIsPhoneNoValid] = React.useState(true);

  const handlePhoneChange = (e) => {
    const v = e.target.value;
    setPhone(v);
    setIsPhoneNoValid(v !== "" && v.length === 10);
  };

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    setIsValidEmail(v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      email === "" || firstName === "" || lastName === "" ||
      address === "" || city === "" || state === "" ||
      country === "" || pinCode === "" || phoneNo === ""
    ) {
      alert.error("Please fill all the fields");
      return;
    }

    if (phoneNo && phoneNo.length !== 10) {
      alert.error("Phone Number should be 10 digits Long");
      return;
    }

    dispatch(
      saveShippingInfo({
        address, city, state, country, pinCode, phoneNo, email, firstName, lastName,
      })
    );
    history.push("/process/payment");
  };

  const field = "field";
  const label = "mb-1.5 block text-sm font-semibold text-ink-700";

  return (
    <PageShell>
      <MetaData title="Shipping Info" />
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:py-14">
        <CheckoutSteps activeStep={1} />

        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <div className="glass glass-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                <HomeIcon size={18} />
              </span>
              <h2 className="text-lg font-bold text-ink-900">Shipping Address</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label}>First Name</label>
                <input className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className={label}>Last Name</label>
                <input className={field} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>

              <div className="sm:col-span-2">
                <label className={label}>
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> Address</span>
                </label>
                <input className={field} value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div>
                <label className={label}>City</label>
                <input className={field} value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label className={label}>Pincode</label>
                <input className={field} value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
              </div>
              <div>
                <label className={label}>State</label>
                <input className={field} value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div>
                <label className={label}>Country</label>
                <input className={field} value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>

              <div>
                <label className={label}>
                  <span className="inline-flex items-center gap-1.5"><Phone size={14} /> Phone</span>
                </label>
                <input className={field} value={phoneNo} onChange={handlePhoneChange} />
                {!isPhoneNoValid && phoneNo && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">Please enter a valid 10-digit phone number.</p>
                )}
              </div>
              <div>
                <label className={label}>
                  <span className="inline-flex items-center gap-1.5"><Mail size={14} /> Email</span>
                </label>
                <input type="email" className={field} value={email} onChange={handleEmailChange} />
                {!isValidEmail && email && (
                  <p className="mt-1 text-xs font-medium text-brand-dark">Please enter a valid email address.</p>
                )}
              </div>

              <label className="flex items-start gap-3 text-sm text-ink-700 sm:col-span-2">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                Save Address to Address Book
              </label>
              <label className="flex items-start gap-3 text-sm text-ink-700 sm:col-span-2">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand" checked={sameBillingDelivery} onChange={(e) => setSameBillingDelivery(e.target.checked)} />
                My billing and delivery information are the same.
              </label>

              <div className="sm:col-span-2 mt-2">
                <button type="submit" className="btn-brand w-full sm:w-auto">
                  <CreditCard size={18} /> Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
};

export default Shipping;