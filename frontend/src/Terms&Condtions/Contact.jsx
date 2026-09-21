import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageSquareText, MapPin, Clock, Send, Headphones } from "lucide-react";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import MetaData from "../component/layouts/MataData/MataData";
import { PageShell, SectionHeading, GlassCard } from "../ui/kit";

const ContactForm = () => {
  const alert = useAlert();
  const history = useHistory();

  const handleCall = () => {
    window.location.href = "tel:+8171280446";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert.success("Your message has been sent successfully");
    history.push("/");
  };

  return (
    <PageShell>
      <MetaData title="Contact Us" />
      <div className="mx-auto w-full max-w-5xl px-5 py-14">
        <SectionHeading
          eyebrow="We're here to help"
          title="Contact Us"
          subtitle="Live chat, email, or call — we'll get back to you shortly."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Info panel */}
          <div className="space-y-4">
            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Headphones size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-ink-900">Need Help?</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    We have live chat available, look for the chat icon in the lower right hand
                    corner of this page. If it isn't there, then give us a call at{" "}
                    <button
                      onClick={handleCall}
                      className="font-semibold text-brand underline underline-offset-2"
                    >
                      8171280446
                    </button>
                    .
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-900/90 text-white">
                  <Clock size={20} />
                </span>
                <div className="text-sm text-ink-600">
                  <h3 className="font-bold text-ink-900">Business Hours</h3>
                  <p className="mt-2 leading-relaxed">
                    7:00-6:00 MST Monday-Friday
                    <br />
                    9:00-4:00 MST Saturday
                    <br />
                    Closed Sunday
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <MapPin size={20} />
                </span>
                <div className="text-sm leading-relaxed text-ink-600">
                  <h3 className="font-bold text-ink-900">CricketWeapon Store, Pvt Ltd.</h3>
                  <p className="mt-2">
                    15130 Sec 22
                    <br />
                    Noida, UP 201301
                    <br />
                    India
                  </p>
                </div>
              </div>
            </GlassCard>

            <p className="glass flex items-center gap-3 rounded-xl px-5 py-4 text-sm text-ink-600">
              <MessageSquareText size={18} className="shrink-0 text-brand" />
              Catch us outside these hours? Fill out the support form and we'll be in touch
              shortly.
            </p>
          </div>

          {/* Support form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <GlassCard className="p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900">
                <MessageSquareText size={20} className="text-brand" /> Support Form
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                <Field label="Issue *">
                  <select id="issue-select" className="field" defaultValue="e-commerce">
                    <option value="e-commerce">E-Commerce</option>
                    <option value="app">App</option>
                  </select>
                </Field>

                <Field label="Detail *">
                  <select id="detail-select" className="field" defaultValue="others">
                    <option value="availability">Availability</option>
                    <option value="return/exchange">Return/Exchange</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="invoicing">Invoicing</option>
                    <option value="tracking-info">Tracking Info</option>
                    <option value="others">Others</option>
                  </select>
                </Field>

                <Field label="Language *">
                  <select id="language-select" className="field" defaultValue="english">
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="japanese">Japanese</option>
                    <option value="chinese">Chinese</option>
                    <option value="german">German</option>
                  </select>
                </Field>

                <Field label="Email *">
                  <input id="email-input" type="email" className="field" placeholder="Enter Your Email *" />
                </Field>

                <Field label="Message *">
                  <textarea id="message-textarea" rows={6} className="field resize-none" placeholder="Enter Your Message *" />
                </Field>

                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn-brand w-fit">
                    <Send size={16} /> Submit
                  </button>
                  <button type="button" onClick={handleCall} className="btn-ghost w-fit">
                    <Phone size={16} /> Call Us
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-600">
      {label}
    </label>
    {children}
  </div>
);

export default ContactForm;