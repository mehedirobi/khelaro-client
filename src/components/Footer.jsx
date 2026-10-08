import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { name: "Find a Turf", path: "/turfs" },
    { name: "How It Works", path: "/about" },
    {
      name: "Become a Turf Owner",
      path: "/register?role=owner",
    },
    { name: "Contact Us", path: "/contact" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Refund Policy", path: "/refund" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: FaFacebookF,
    },
    {
      name: "Instagram",
      href: "#",
      icon: FaInstagram,
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: FaLinkedinIn,
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-gray-800 bg-gray-950 text-gray-300">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-green-500/[0.05] blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
              aria-label="Khelaro home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-lg font-extrabold text-gray-950 shadow-lg shadow-green-500/10 transition-transform duration-300 group-hover:scale-105">
                K
              </div>

              <span className="text-xl font-extrabold tracking-[-0.02em] text-white">
                Khelaro
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Discover and book sports turfs around Dhaka. Find your
              game, choose your time, and get playing without the
              hassle.
            </p>

            {/* Brand CTA */}
            <Link
              to="/turfs"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-green-400"
            >
              Find your next game

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/60 text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <span>{link.name}</span>

                    <ArrowUpRight
                      size={13}
                      className="ml-1 -translate-x-1 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
              Support
            </h3>

            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <span>{link.name}</span>

                    <ArrowUpRight
                      size={13}
                      className="ml-1 -translate-x-1 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-3">
              {/* Location */}
              <div className="flex items-start gap-3 rounded-xl border border-gray-800/80 bg-gray-900/40 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                  <MapPin size={15} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Location
                  </p>

                  <p className="mt-0.5 text-sm text-gray-400">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              {/* Email */}
              <a
                href="mailto:support@khelaro.com"
                className="group flex items-start gap-3 rounded-xl border border-gray-800/80 bg-gray-900/40 p-3 transition-colors duration-200 hover:border-green-500/20 hover:bg-gray-900"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                  <Mail size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm text-gray-400 transition-colors group-hover:text-white">
                    support@khelaro.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+8801336458100"
                className="group flex items-start gap-3 rounded-xl border border-gray-800/80 bg-gray-900/40 p-3 transition-colors duration-200 hover:border-green-500/20 hover:bg-gray-900"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                  <Phone size={15} />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm text-gray-400 transition-colors group-hover:text-white">
                    +880 1336 458100
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-gray-800 pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">
              © {currentYear} Khelaro. All rights reserved.
            </p>

            <p className="text-xs text-gray-600">
              Built for players. Made for the game.
            </p>
          </div>

          <Link
            to="/turfs"
            className="group inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-gray-400 transition-colors hover:text-green-400"
          >
            Explore turfs

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;