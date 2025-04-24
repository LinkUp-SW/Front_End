// import React from "react";

// interface Job {
//   title: string;
//   company: string;
//   location: string;
//   applicants: string;
//   alumni: string;
//   time: string;
//   logo: string;
// }

// const Jobs: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
//     return (
//         <div className="flex justify-center mt-6">
//           <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
//             <h2 className="text-xl font-semibold mb-4">Jobs</h2>
//             <div className="space-y-4">
//               {jobs.map((job, index) => (
//                 <div key={index} className="p-4 border-b last:border-none bg-white dark:bg-gray-800">
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center space-x-4">
//                       <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-md" />
//                       <div>
//                         <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
//                         {job.alumni && <p className="text-xs text-gray-500 dark:text-gray-400">{job.alumni}</p>}
//                         <p className="text-xs text-gray-500 dark:text-gray-400">{job.time}</p>
//                       </div>
//                     </div>
//                     <button className="px-4 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700">Save</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button className="w-full mt-2 py-2 text-gray-500 dark:text-gray-400 border-t pt-2">See all job results in Egypt</button>
//           </div>
//         </div>
//       );
//     };
    

// export default Jobs;
