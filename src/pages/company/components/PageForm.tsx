import { FormEvent } from 'react';

interface PageFormProps {
  type: 'company' | 'education';
  onSubmit: (e: FormEvent) => void;
}

export const PageForm: React.FC<PageFormProps> = ({ type, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <p className="text-xs text-gray-500 mb-4">* indicates required</p>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Name*</label>
        <input 
          type="text" 
          placeholder="Add your organization's name" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
          {type === 'company' ? 'linkUp.com/company/*' : 'linkUp.com/school/*'}
        </label>
        <input 
          type="text" 
          placeholder="Add your unique LinkUp address" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <a href="#" className="text-blue-600 text-sm mt-1 block">Learn more about the Page Public URL</a>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Website</label>
        <input 
          type="text" 
          placeholder="Begin with http://, https:// or www." 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Industry*</label>
        <input 
          type="text" 
          placeholder="ex: Information Services" 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Organization size*</label>
        <div className="relative">
          <select 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1001-5000">1001-5000 employees</option>
            <option value="5001-10000">5001-10000 employees</option>
            <option value="10001+">10001+ employees</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Organization type*</label>
        <div className="relative">
          <select 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            {type === 'company' ? (
              <>
                <option value="public">Public company</option>
                <option value="private">Private company</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="government">Government agency</option>
                <option value="partnership">Partnership</option>
              </>
            ) : (
              <>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="highschool">High School</option>
                <option value="middleschool">Middle School</option>
                <option value="elementary">Elementary School</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Logo</label>
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded p-6 flex flex-col items-center justify-center text-center">
          <div className="mb-2">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="text-blue-600">Choose file</span>
          <span className="text-sm text-gray-500 mt-1">Upload to see preview</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">300 x 300px recommended. JPGs, JPEGs, and PNGs supported.</p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Tagline</label>
        <textarea 
          placeholder="ex: An information services firm helping small businesses succeed." 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={120}
        ></textarea>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Use your tagline to briefly describe what your organization does. This can be changed later.</span>
          <span>0/120</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 mr-2"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
            I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.
          </label>
        </div>
        <a href="#" className="text-blue-600 text-sm mt-1 block">Read the LinkUp Pages Terms</a>
      </div>

      <div className="flex justify-center mt-6">
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
        >
          Create page
        </button>
      </div>
    </form>
  );
};

export default PageForm;