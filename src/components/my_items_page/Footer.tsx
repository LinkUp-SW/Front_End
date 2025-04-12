import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium mb-2">About</h3>
            <ul className="space-y-2">
              <li><button id="policies-btn">Professional Community Policies</button></li>
              <li><button id="privacy-terms-btn">Privacy & Terms</button></li>
              <li><button id="sales-solutions-btn">Sales Solutions</button></li>
              <li><button id="safety-center-btn">Safety Center</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Accessibility</h3>
            <ul className="space-y-2">
              <li><button id="careers-btn">Careers</button></li>
              <li><button id="ad-choices-btn">Ad Choices</button></li>
              <li><button id="mobile-btn">Mobile</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Talent Solutions</h3>
            <ul className="space-y-2">
              <li><button id="marketing-solutions-btn">Marketing Solutions</button></li>
              <li><button id="advertising-btn">Advertising</button></li>
              <li><button id="small-business-btn">Small Business</button></li>
            </ul>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Questions?</h3>
              <p className="text-sm"><button id="help-center-btn">Visit our Help Center.</button></p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-1">Manage your account and privacy</h3>
              <p className="text-sm"><button id="settings-btn">Go to your Settings.</button></p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Recommendation transparency</h3>
              <p className="text-sm"><button id="recommended-content-btn">Learn more about Recommended Content.</button></p>
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex justify-center items-center">
          <img className="w-5 h-5" src="/link_up_logo.png" alt="LinkUp Logo"></img>
          <span className="ml-2">LinkUp Corporation © 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;