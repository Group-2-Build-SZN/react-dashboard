import Button from "../../components/Button/Button";

import houseImage from "../../assets/branding/welcome-screen-house.png";

type WelcomeProps = {
  onGetStarted?: () => void;
  onLogIn?: () => void;
};

function Welcome({ onGetStarted, onLogIn }: WelcomeProps) {
  return (
    <div style={{ padding: '15px 10px', backgroundColor: '#cfe6f5' }} className="welcomebg flex h-screen flex-col overflow-hidden bg-gray-50">

      <div className="relative min-h-0 flex-1">
        <img
          src={houseImage}
          alt="Modern house"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="-mt-10 mx-4 mb-6 flex flex-shrink-0 flex-col gap-3 rounded-2xl bg-white px-6 py-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">

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
