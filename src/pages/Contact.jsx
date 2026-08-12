import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock3,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Contact Khelaro
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              How can we help?
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-500">
              Have a question about booking, becoming a turf owner,
              or using Khelaro? Send us a message and our team will
              get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact information */}
          <div className="rounded-2xl bg-gray-950 p-7 text-white sm:p-8">
            <p className="text-sm font-semibold text-green-400">
              Get in touch
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              We'd love to hear from you.
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Whether you are a player looking for help or a turf
              owner interested in joining Khelaro, our team is here
              to help.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-green-400">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>

                  <a
                    href="mailto:support@khelaro.com"
                    className="mt-1 block text-sm text-gray-200 transition hover:text-green-400"
                  >
                    support@khelaro.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-green-400">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <a
                    href="tel:+8801000000000"
                    className="mt-1 block text-sm text-gray-200 transition hover:text-green-400"
                  >
                    +8801336458100
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-green-400">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-green-400">
                  <Clock3 size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Support hours
                  </p>

                  <p className="mt-1 text-sm text-gray-200">
                    Sat – Thu, 9:00 AM – 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-800 pt-6">
              <div className="flex items-center gap-3">
                <MessageSquare
                  size={18}
                  className="text-green-400"
                />

                <p className="text-sm text-gray-400">
                  Usually responds within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                Send us a message
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Fill out the form below and we'll get back to you.
              </p>
            </div>

            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={28} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Message sent successfully
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Thanks for contacting Khelaro. We'll get back to
                  you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>

                    <option value="booking">
                      Booking support
                    </option>

                    <option value="owner">
                      Become a turf owner
                    </option>

                    <option value="payment">
                      Payment issue
                    </option>

                    <option value="technical">
                      Technical issue
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20"
                >
                  Send Message
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">
            Looking for quick answers?
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Check our help resources before contacting support.
          </p>

          <a
            href="#"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
          >
            Visit Help Center
            <MessageSquare size={16} />
          </a>
        </div>
      </section>
    </main>
  );
};

export default Contact;