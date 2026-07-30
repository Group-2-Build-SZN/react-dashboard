import { useState, type FormEvent, type ChangeEvent } from "react";
import { Phone, Mail, MapPin, Headphones, Send } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import heroImage from "../assets/images/Ellipse 16.png";
import mapImage from "../assets/images/Rectangle 51.png";

export function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  function update(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-h1 font-bold text-neutral">Contact Us</h1>
              <p className="mt-2 max-w-md text-body text-neutral-500">
                We're here to help! Reach out to us for any questions or
                support.
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Phone size={18} />
                  </span>
                  <div>
                    <p className="text-small text-neutral-500">Phone</p>
                    <p className="text-body font-semibold text-neutral">
                      +234 801 234 5678
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Mail size={18} />
                  </span>
                  <div>
                    <p className="text-small text-neutral-500">Email</p>
                    <p className="text-body font-semibold text-neutral">
                      hello@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <p className="text-small text-neutral-500">Office</p>
                    <p className="text-body font-semibold text-neutral">
                      Trans-Ekulu, Enugu, Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <img
              src={heroImage}
              alt="My Ulo office interior"
              className="mx-auto h-72 w-72 rounded-full object-cover sm:h-80 sm:w-80"
            />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-h4 font-bold text-neutral">
                Send us a message
              </h2>
              <p className="mt-1 text-small text-neutral-500">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={update("fullName")}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-body placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-body placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={update("subject")}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-body placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral">
                    Message
                  </label>
                  <textarea
                    placeholder="Type your message here..."
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-body placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <Button type="submit" size="lg" icon={<Send size={16} />}>
                  Send Message
                </Button>
              </form>
            </div>

            <div className="h-fit rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-h4 font-bold text-neutral">
                Other ways to reach us
              </h2>

              <div className="mt-6 flex flex-col gap-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Headphones size={16} />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-neutral">
                      Customer Support
                    </p>
                    <p className="text-small text-neutral-500">
                      We're available 24/7 to assist you.
                    </p>
                    <p className="text-small font-medium text-primary">
                      +234 810 123 4567
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <Mail size={16} />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-neutral">
                      Email Us
                    </p>
                    <p className="text-small text-neutral-500">
                      We typically reply within 24 hours.
                    </p>
                    <p className="text-small font-medium text-primary">
                      support@myulo.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <p className="text-small font-semibold text-neutral">
                      Visit Our Office
                    </p>
                    <p className="text-small text-neutral-500">
                      12 Utu Street, New Haven, Enugu, Nigeria
                    </p>
                    <p className="text-small text-neutral-500">
                      Mon - Fri 9am - 5pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <img
            src={mapImage}
            alt="Map of My Ulo office location"
            className="mt-10 h-72 w-full rounded-2xl object-cover"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
