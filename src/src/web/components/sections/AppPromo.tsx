import { GooglePlayIcon, AppleIcon } from "../ui/StoreIcons";
import promoImage from "../../assets/images/ChatGPT Image Jul 14, 2026, 03_48_04 PM 1.png";
import phoneImage from "../../assets/images/ChatGPT Image Jul 15, 2026, 08_57_45 PM 1.png";

export function AppPromo() {
  return (
    <section className="bg-neutral-100 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <img
              src={promoImage}
              alt="My Ulo app on a smartphone"
              className="w-full rounded-2xl object-cover"
            />
            <img
              src={phoneImage}
              alt="Hand holding a phone with the My Ulo app open"
              className="absolute -right-6 bottom-0 h-[85%] w-auto drop-shadow-xl sm:-right-10"
            />
          </div>

          <div>
            <h2 className="text-h2 font-bold text-neutral">
              Explore with confidence anytime, anywhere
            </h2>
            <p className="mt-3 max-w-md text-body text-neutral-500">
              My Ulo app gives you the power to search, verify, and connect on
              the go.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl bg-neutral px-5 py-3 text-white"
              >
                <GooglePlayIcon size={22} />
                <span className="text-left">
                  <span className="block text-caption text-neutral-300">
                    Get it on
                  </span>
                  <span className="block text-body font-semibold">
                    Google Play
                  </span>
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl bg-neutral px-5 py-3 text-white"
              >
                <AppleIcon size={22} />
                <span className="text-left">
                  <span className="block text-caption text-neutral-300">
                    Download on the
                  </span>
                  <span className="block text-body font-semibold">
                    App Store
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
