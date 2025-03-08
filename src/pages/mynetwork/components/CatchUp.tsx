import { useState } from "react";
import { FaThumbsUp, FaCommentDots } from "react-icons/fa";
import { FILTER_OPTIONS, FILTERS_LIST } from "../../../constants/index.ts";

const CatchUp = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const updates = [
    {
      id: 1,
      name: "John Anderson",
      profileImg:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      event: "Started a new position at",
      company: "Google",
      message: "🎉 Congrats on your new role!",
      likes: 55,
      comments: 18,
      type:"job_change"
    },
    {
      id: 2,
      name: "Emily Roberts",
      profileImg:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      event: "Celebrating a work anniversary at",
      company: "Amazon",
      message: "🎉 Happy 5-year work anniversary!",
      likes: 42,
      comments: 10,
      type:"work_anniversary"
    },
    {
      id: 3,
      name: "Michael Johnson",
      profileImg:
        "https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg",
      event: "Completed a professional certification in",
      company: "Data Analytics",
      message: "🎓 Congratulations on your achievement!",
      likes: 67,
      comments: 22,
      type:"education"
    },
    {
      id: 4,
      name: "Jessica Taylor",
      profileImg:
        "https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg",
      event: "Celebrated Jessica's birthday today",
      message: "Wishing you a happy birthday!",
      type:"birthday",
      
      
    },
  ];

  const filterMap={
    [FILTER_OPTIONS.ALL]:updates,
    [FILTER_OPTIONS.JOB_CHANGES]:updates.filter((update)=>update.type==="job_change"),
    [FILTER_OPTIONS.WORK_ANNIVERSARIES]:updates.filter((update)=>update.type==="work_anniversary"), 
    [FILTER_OPTIONS.EDUCATION]:updates.filter((update)=>update.type==="education"),
    [FILTER_OPTIONS.BIRTHDAYS]:updates.filter((update)=>update.type==="birthday"),
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 mt-5 w-full max-w-2xl mx-auto transition-all">
      {/*  Filter Buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        {FILTERS_LIST.map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/*  Activity List */}
      <div className="mt-4 space-y-3">
        {filterMap[activeFilter].map((update) => (
          <div
            key={update.id}
            className="p-3 rounded-lg flex items-start space-x-3 bg-gray-50 dark:bg-gray-800 transition-all hover:shadow-md dark:hover:shadow-gray-700"
          >
            {/* Profile Picture */}
            <img
              src={update.profileImg}
              alt={update.name}
              className="w-10 h-10 rounded-full"
            />

            {/* Content */}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                {update.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {update.event}{" "}
                <span className="font-semibold">{update.company}</span>
              </p>

              {/* Action Button */}
              <button className="mt-1 px-3 py-1 text-sm text-blue-600 font-semibold bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full transition-all cursor-pointer">
                {update.message}
              </button>

              {/* Engagement Section */}
              <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400 text-xs">
                {update.likes? (
                  <span className="flex items-center space-x-1">
                    <FaThumbsUp className="text-gray-600 dark:text-gray-300" />{" "}
                    <span>{update.likes}</span>
                  </span>
                ):null}
                {update.comments ? (
                  <span className="flex items-center space-x-1 ml-3">
                    <FaCommentDots className="text-gray-600 dark:text-gray-300" />{" "}
                    <span>{update.comments}</span>
                  </span>
                ):null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatchUp;
