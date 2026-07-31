import {
  ShieldCheck,
  Video,
  MapPin,
  Star,
  Target,
  Eye,
  ShieldHalf,
  Lightbulb,
  Users,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import heroImage from "../assets/images/Rectangle 3 (2).png";
import storyImage from "../assets/images/Frame 427318561.png";

import chisomOkoh from "../assets/images/Chisom Okoh.png";
import chinazorEchezona from "../assets/images/Chinazor Echezona.png";
import makuachukwuIloabachie from "../assets/images/Makuachukwu Iloabachie.png";
import soromtochukwuUgwu from "../assets/images/Soromtochukwu Ugwu.png";
import eseOmamuyowi from "../assets/images/Ese Omamuyowi.png";
import okoyeGloria from "../assets/images/Okoye Gloria.png";
import victorEzeilo from "../assets/images/Victor Ezeilo.png";
import laurynOkofu from "../assets/images/Lauryn Okofu.png";
import jessicaUkwuegbu from "../assets/images/Jessica Ukwuegbu.png";
import chibuikemJonNwakalo from "../assets/images/Chibuikem JonNwakalo.png";
import patriciaOko from "../assets/images/Patricia Oko.png";
import oluchukwuAnakor from "../assets/images/Oluchukwu Anakor.png";
import onuVivian from "../assets/images/Onu Vivian.png";
import odohPraise from "../assets/images/Odoh praise.png";
import maximusUdeh from "../assets/images/Maximus Udeh.png";
import amarachiObinze from "../assets/images/Amarachi Obinze.png";

const features = [
  { icon: ShieldCheck, title: "Verified Listings", description: "Every property is authenticated" },
  { icon: Video, title: "Video Walkthroughs", description: "See real conditions before you go" },
  { icon: MapPin, title: "Smart Maps", description: "Explore neighborhoods with confidence" },
  { icon: Star, title: "Community Reviews", description: "Real experience from real tenants" },
];

const values = [
  { icon: ShieldHalf, title: "Trust", description: "We believe in transparency and honesty in everything we do.", bg: "bg-primary-100", color: "text-primary" },
  { icon: Lightbulb, title: "Innovation", description: "We use technology to create simple and smart solutions.", bg: "bg-[#EEF2FF]", color: "text-[#6366F1]" },
  { icon: Target, title: "Customer Focus", description: "Our users are at the heart of every decision we make.", bg: "bg-accent-50", color: "text-accent-600" },
  { icon: Users, title: "Community", description: "We are committed to building better communities.", bg: "bg-secondary-50", color: "text-secondary" },
];

const team = [
  { photo: chisomOkoh, name: "Chisom Okoh", role: "Lead Product Manager" },
  { photo: chinazorEchezona, name: "Chinazor Echezona", role: "Lead Product Designer" },
  { photo: makuachukwuIloabachie, name: "Makuachukwu Iloabachie", role: "Lead Frontend Dev." },
  { photo: soromtochukwuUgwu, name: "Soromtochukwu Ugwu", role: "Lead Backend Dev." },
  { photo: eseOmamuyowi, name: "Ese Omamuyowi", role: "Digital Marketing Lead" },
  { photo: okoyeGloria, name: "Okoye Gloria", role: "Quality Assurance Lead" },
  { photo: victorEzeilo, name: "Victor Ezeilo", role: "Lead Data Analyst" },
  { photo: laurynOkofu, name: "Lauryn Okofu", role: "Product Designer" },
  { photo: jessicaUkwuegbu, name: "Jessica Ukwuegbu", role: "Product Designer" },
  { photo: chibuikemJonNwakalo, name: "Chibuikem JonNwakalo", role: "Product Designer" },
  { photo: patriciaOko, name: "Patricia Oko", role: "Product Manager" },
  { photo: oluchukwuAnakor, name: "Oluchukwu Anakor", role: "Backend Dev." },
  { photo: onuVivian, name: "Onu Vivian", role: "Data Analyst" },
  { photo: odohPraise, name: "Odoh praise", role: "Frontend Dev." },
  { photo: maximusUdeh, name: "Maximus Udeh", role: "Frontend Dev." },
  { photo: amarachiObinze, name: "Amarachi Obinze", role: "Data Analyst" },
];

export function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-caption font-medium text-primary">
            About My Ulo
          </span>

          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-h1 font-bold text-neutral">
                Know before you go.
                <br />
                Rent with confidence.
              </h1>
              <p className="mt-4 text-body text-neutral-500">
                My Ulo was built to solve the problems tenants face in
                Nigeria's rental market - deception, hidden issues, and
                wasted money.
              </p>
              <p className="mt-4 text-body text-neutral-500">
                We use technology, verification, and transparency to help you
                find properties you can trust.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {features.map((f) => (
                  <div key={f.title}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
                      <f.icon size={18} />
                    </span>
                    <p className="mt-2 text-small font-semibold text-neutral">
                      {f.title}
                    </p>
                    <p className="text-caption text-neutral-500">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <img
              src={heroImage}
              alt="My Ulo verified property"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-h2 font-bold text-neutral">Our Story</h2>
              <div className="mt-4 flex flex-col gap-4 text-body text-neutral-500">
                <p>
                  Finding a home in Nigeria should be exciting - not
                  stressful. Yet for many renters, the journey is filled with
                  fake property listings, expensive inspection fees,
                  misleading information, and uncertainty about the people
                  behind the listings.
                </p>
                <p>That's why My Ulo was created.</p>
                <p>
                  We believe everyone deserves access to honest property
                  information before making one of life's biggest decisions.
                  Our platform combines verified property listings,
                  identity-verified landlords and agents, authentic video
                  walkthroughs, neighborhood insights, and trusted community
                  reviews to help renters make informed choices with
                  confidence.
                </p>
                <p>
                  At My Ulo, we're more than a property platform - we're
                  building a future where transparency replaces uncertainty
                  and trust becomes the standard in Nigeria's rental market.
                  Whether you're searching for your first apartment,
                  relocating, or listing a property, we're here to make the
                  experience safer, smarter, and simpler.
                </p>
                <p className="font-semibold text-neutral">Know Before You Go.</p>
              </div>
            </div>

            <img
              src={storyImage}
              alt="A well decorated living room"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-20 grid grid-cols-1 divide-y divide-neutral-300 rounded-2xl bg-primary-50 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary">
                <Target size={20} />
              </span>
              <h3 className="mt-4 text-h4 font-semibold text-neutral">
                Our Mission
              </h3>
              <p className="mt-2 text-body text-neutral-500">
                To transform the property rental experience in Nigeria by
                providing a trusted platform where users can discover
                verified listings, validate property information, and make
                confident housing decisions through transparency, innovation,
                and security.
              </p>
            </div>
            <div className="p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary">
                <Eye size={20} />
              </span>
              <h3 className="mt-4 text-h4 font-semibold text-neutral">
                Our Vision
              </h3>
              <p className="mt-2 text-body text-neutral-500">
                To become Nigeria's most trusted property verification
                platform, creating a future where everyone can find, verify,
                and secure a home with confidence - free from scams,
                misinformation, and uncertainty.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-h2 font-bold text-neutral">Our Values</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-neutral-200 p-6"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.bg} ${v.color}`}
                  >
                    <v.icon size={20} />
                  </span>
                  <h3 className="mt-4 text-h4 font-semibold text-neutral">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-small text-neutral-500">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-h2 font-bold text-neutral">Meet the Team</h2>
            <p className="mt-2 text-body text-neutral-500">
              We're a passionate team working together to make property
              search better for everyone.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.name} className="text-left">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="aspect-[6/5] w-full rounded-xl object-cover"
                  />
                  <p className="mt-3 text-body font-semibold text-neutral">
                    {member.name}
                  </p>
                  <p className="text-small text-neutral-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
