import LandingNavBar from "./landing_nav_bar/LandingNavBar";

const HomePage = () => {
  return (
    <main className="flex flex-col items-center w-full p-5">
      <header className="max-w-[70rem] w-full">
        <LandingNavBar />
      </header>

    </main>
  );
};

export default HomePage;
