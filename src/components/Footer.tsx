import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2025 Movie App. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-gray-300">Terms of Service</a>
            <a href="#" className="text-sm hover:text-gray-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;