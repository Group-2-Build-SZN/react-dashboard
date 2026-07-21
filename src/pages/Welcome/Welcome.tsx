import Button from "../../components/Button/Button";

import houseImage from "../../assets/branding/welcome-screen-house.png";

type WelcomeProps = {
  onGetStarted?: () => void;
  onLogIn?: () => void;
};

function Welcome({ onGetStarted, onLogIn }: WelcomeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      {/* Photo — full width, natural aspect ratio, never cropped */}
      <img
        src={houseImage}
        alt="Modern house"
        className="w-full flex-shrink-0"
      />

      {/* Floating card — pulled up to overlap the bottom of the photo so the
          rounded corners actually show against the image, not against more white */}
      <div className="-mt-10 mx-4 mb-6 flex flex-col gap-3 rounded-2xl bg-white px-6 py-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">

        <div>
          <h1 className="text-[28px] font-bold leading-9 text-gray-900">
            Welcome to <span className="text-primary-800">My Ulo</span>
          </h1>

          <p className="mt-2 text-base leading-6 text-gray-500">
            The smarter way to find rent verified properties in Nigeria.
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={onGetStarted} className="w-full">
          Get Started
        </Button>

        <Button variant="outline" size="lg" onClick={onLogIn} className="w-full">
          Log In
        </Button>

      </div>

    </div>
  );
}

export default Welcome;
