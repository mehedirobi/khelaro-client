import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock3,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@khelaro.com",
    href: "mailto:support@khelaro.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+8801336458100",
    href: "tel:+8801336458100",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
  },
  {
    icon: Clock3,
    label: "Support hours",
    value: "Sat – Thu, 9:00 AM – 8:00 PM",
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-green-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <MessageSquare size={14} />
              Contact Khelaro
            </div>

            <div className="mt-5 flex items-start gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                How can we{" "}
                <span className="text-green-600">
                  help?
                </span>
              </h1>

              <Sparkles
                size={24}
                className="mt-2 hidden animate-pulse text-green-500 sm:block"
              />
            </div>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Have a question about booking, payments, or
              becoming a turf owner? Send us a message and
              our team will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          {/* Contact information */}
          <div className="group relative overflow-hidden rounded-3xl bg-gray-950 p-7 text-white shadow-xl shadow-gray-200/50 sm:p-9">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-green-500/10 blur-2xl transition duration-700 group-hover:bg-green-500/20" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-green-500/5 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                Get in touch
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                We'd love to hear from you.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                Whether you're a player looking for help or
                a turf owner interested in joining Khelaro,
                our team is here to help.
              </p>

              <div className="mt-9 space-y-3">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;

                  const content = (
                    <div
                      className="group/item flex gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-800 hover:bg-gray-900"
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-green-400 transition-all duration-300 group-hover/item:scale-105 group-hover/item:bg-green-500 group-hover/item:text-white">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="text-xs font-medium text-gray-500">
                          {item.label}
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-200">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>
                      {content}
                    </div>
                  );
                })}
              </div>

              {/* Response info */}
              <div className="mt-9 border-t border-gray-800 pt-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <MessageSquare size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-200">
                      Quick response
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      We usually respond within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm duration-700 sm:p-9">
            {!submitted ? (
              <>
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        Send us a message
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Fill out the form and we'll get back
                        to you as soon as possible.
                      </p>
                    </div>

                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:flex">
                      <Send size={19} />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="group">
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
                        className={`${inputClass} h-12`}
                      />
                    </div>

                    <div className="group">
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
                        className={`${inputClass} h-12`}
                      />
                    </div>
                  </div>

                  {/* Subject */}
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
                      className={`${inputClass} h-12`}
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

                  {/* Message */}
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
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className={`${inputClass} resize-none py-3`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-green-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />

                    <span className="relative flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    We'll only use your information to
                    respond to your message.
                  </p>
                </form>
              </>
            ) : (
              <div className="flex min-h-[500px] flex-col items-center justify-center px-4 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-200/50" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2
                      size={42}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <h3 className="mt-7 text-2xl font-bold text-gray-900">
                  Message sent successfully
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
                  Thanks for contacting Khelaro. Your
                  message has been received and our team
                  will get back to you as soon as possible.
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={14} />
                  We'll respond within 24 hours
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
                >
                  Send another message
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <MessageSquare size={20} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
            Looking for quick answers?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Check our help resources before contacting
            support.
          </p>

          <a
            href="#"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-100"
          >
            Visit Help Center
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>
    </main>
  );
};

export default Contact;