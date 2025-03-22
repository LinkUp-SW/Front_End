// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium mb-2">About</h3>
            <ul className="space-y-2">
              <li>Professional Community Policies</li>
              <li>Privacy & Terms</li>
              <li>Sales Solutions</li>
              <li>Safety Center</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Accessibility</h3>
            <ul className="space-y-2">
              <li>Careers</li>
              <li>Ad Choices</li>
              <li>Mobile</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Talent Solutions</h3>
            <ul className="space-y-2">
              <li>Marketing Solutions</li>
              <li>Advertising</li>
              <li>Small Business</li>
            </ul>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="font-medium mb-1">Questions?</h3>
              <p className="text-sm">Visit our Help Center.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-1">Manage your account and privacy</h3>
              <p className="text-sm">Go to your Settings.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Recommendation transparency</h3>
              <p className="text-sm">Learn more about Recommended Content.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center sm:text-left">
          <p>LinkUp Corporation © 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;