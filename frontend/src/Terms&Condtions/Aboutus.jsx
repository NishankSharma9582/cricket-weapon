import React from "react";
import { motion } from "framer-motion";
import { Target, Users, BookOpen, ShoppingBag, Phone } from "lucide-react";
import MetaData from "../component/layouts/MataData/MataData";
import TermsImage from "../Image/about/tc.jpg";
import { Link } from "react-router-dom";
import { PageShell, SectionHeading } from "../ui/kit";

const About_UsPage = () => {
  return (
    <PageShell>
      <MetaData title="About Us" />
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <SectionHeading
          eyebrow="Since 2019"
          title="About Us"
          subtitle="The online cricket store trusted by thousands of players."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            src={TermsImage}
            alt="CricketWeapon"
            className="glass w-full rounded-3xl p-3"
          />
          <div className="space-y-5 text-ink-700">
            <p className="text-lg leading-relaxed">
              CricketWeapon store is an online cricket sports selling startup started in 2019.
              We have served more than 20,000 customers through social media and other platforms.
              We are proud to offer our own products under the brand name CW, also known as
              "Cricket Weapon".
            </p>
            <p className="text-[15px] leading-relaxed">
              CricketWeapon was founded by Lokesh Samant, a talented cricket player who has
              represented the Under 16 and Under 19 teams. Lokesh started this business to
              support his expenses and received an overwhelming response. He has sold cricket
              equipment to more than 20,000 customers till date. Now, he aims to expand his
              business to an international level by launching his own website and introducing
              new and genuine cricket products at competitive prices.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <AboutBlock
            Icon={Users}
            title="Who We Are"
            body="CricketWeapon is dedicated to providing high-quality cricket equipment and accessories to cricket enthusiasts worldwide. With a focus on innovation, craftsmanship, and customer satisfaction, we have become a trusted brand in the cricket community."
          />
          <AboutBlock
            Icon={Target}
            title="Our Mission"
            body="We aim to make cricket accessible to players worldwide and support their passion for the sport — offering bats, balls, protective gear, and accessories that meet the highest standards of quality and performance. Every product we offer delivers exceptional performance on the field."
          />
          <AboutBlock
            Icon={BookOpen}
            title="Our Journey"
            body="Since our inception in 2019, we have built a strong customer base and expanded our product range to cater to the diverse needs of players at every level. Our team of experts works closely with manufacturers to ensure top-notch products."
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/products" className="btn-brand">
            <ShoppingBag size={18} /> Our Products
          </Link>
          <Link to="/contact" className="btn-ghost">
            <Phone size={18} /> Contact Us
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

const AboutBlock = ({ Icon, title, body }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    className="glass glass-card p-6"
  >
    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
      <Icon size={22} />
    </span>
    <h3 className="mt-4 text-lg font-bold text-ink-900">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
  </motion.div>
);

export default About_UsPage;