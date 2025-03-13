// components/withSidebarAd.tsx
import React from "react";

const withSidebarAd= <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => (
    <div className="min-h-screen p-10 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1">
        <WrappedComponent {...props} />
      </div>

      {/* Right Section - Ad & Footer */}
      <div className="hidden lg:flex flex-col items-center w-1/4 p-6">
        <img
          src="/src/assets/see_who's_hiring.jpg"
          alt="Ad"
          className="w-full rounded-lg mb-4"
        />

        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          <div className="flex flex-wrap justify-center space-x-3">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Help Center</a>
          </div>

          <div className="flex flex-wrap justify-center space-x-3 mt-2">
            <a href="#" className="hover:underline">Privacy & Terms</a>
            <a href="#" className="hover:underline">Ad Choices</a>
          </div>

          <div className="flex flex-wrap justify-center space-x-3 mt-2">
            <a href="#" className="hover:underline">Advertising</a>
            <a href="#" className="hover:underline">Business Services</a>
          </div>

          <div className="flex flex-wrap justify-center space-x-3 mt-2">
            <a href="#" className="hover:underline">Get the LinkedIn app</a>
          </div>

          <p className="text-xs text-gray-500 mt-4">LinkUp © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default withSidebarAd;
