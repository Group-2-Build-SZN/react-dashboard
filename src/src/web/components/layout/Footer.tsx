import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "../ui/SocialIcons";
import logo from "../../assets/images/Group 124.svg";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Search Properties", to: "/search" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "List Property", to: "/#list-property" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Help Center", to: "/#help" },
  { label: "Blog", to: "/#blog" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Cookie Policy", to: "/#cookies" },
];

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: TwitterIcon, label: "Twitter", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-body font-semibold text-white">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-small text-primary-100 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="My Ulo" className="h-9 w-9" />
            </Link>
            <p className="mt-4 text-small text-primary-100">
              Building a transparent and trustworthy rental ecosystem for
              everyone.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-400 text-white transition-colors hover:bg-primary-700"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />

          <div>
            <h3 className="mb-4 text-body font-semibold text-white">
              Contact
            </h3>
            <ul className="flex flex-col gap-3 text-small text-primary-100">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@myulo.com" className="hover:text-white">
                  hello@myulo.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+234 901 234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>New Haven, Enugu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-700 pt-6 text-small text-primary-100">
          © {new Date().getFullYear()} My Ulo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
