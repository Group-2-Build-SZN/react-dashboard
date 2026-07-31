import logo from "../../assets/branding/logo.svg";

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-100 via-primary-500 to-primary-900">
      <img
        src={logo}
        alt="My Ulo"
        className="w-48"
      />
    </div>
  );
}

export default Splash;
