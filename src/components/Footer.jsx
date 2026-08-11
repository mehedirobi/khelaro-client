import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
                K
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Khelaro
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
              Discover and book the best sports turfs around Dhaka.
              Find your game, choose your time, and get playing.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-gray-700 hover:bg-gray-900 hover:text-white"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-gray-700 hover:bg-gray-900 hover:text-white"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-gray-700 hover:bg-gray-900 hover:text-white"
              >
                <FaLinkedinIn size={15} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/turfs"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Find a Turf
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Become a Turf Owner
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/refund"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-green-500"
                />

                <span className="text-sm leading-6 text-gray-400">
                  Dhaka, Bangladesh
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-green-500"
                />

                <a
                  href="mailto:support@khelaro.com"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  support@khelaro.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="shrink-0 text-green-500"
                />

                <a
                  href="tel:+8801000000000"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  +880 1000-000000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {currentYear} Khelaro. All rights reserved.
          </p>

          <Link
            to="/turfs"
            className="group inline-flex items-center gap-1 text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Find your next game

            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;