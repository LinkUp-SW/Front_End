import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const ProfileStrength = () => {
  const userBio = useSelector((state: RootState) => state.userBio.data);
  const userSkills = useSelector((state: RootState) => state.skill.items);
  const userExperiences = useSelector(
    (state: RootState) => state.experience.items
  );
  const userEducations = useSelector(
    (state: RootState) => state.education.items
  );
  const userLicenses = useSelector((state: RootState) => state.license.items);

  const completenessItems = [
    { name: "Professional Headline", completed: !!userBio?.bio.headline },
    { name: "Work Experience", completed: userExperiences.length > 0 },
    { name: "Education History", completed: userEducations.length > 0 },
    { name: "Certifications", completed: userLicenses.length > 0 },
    { name: "Skills & Expertise", completed: userSkills.length > 0 },
  ];

  const completedCount = completenessItems.filter(
    (item) => item.completed
  ).length;
  const completionPercentage = Math.round(
    (completedCount / completenessItems.length) * 100
  );

  // Determine progress circle color based on the completion percentage
  const getCircleColor = (percentage: number) => {
    if (percentage === 100) return "stroke-green-500"; // Fully complete
    if (percentage >= 75) return "stroke-yellow-500"; // High completeness
    if (percentage >= 50) return "stroke-orange-500"; // Medium completeness
    return "stroke-red-500"; // Low completeness
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .progress-circle {
          animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .checklist-item {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              Profile Strength
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {completedCount} of {completenessItems.length} sections complete
            </p>
          </div>
          <div className="relative progress-circle">
            <svg className="w-20 h-20" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className={`${getCircleColor(completionPercentage)}`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${completionPercentage * 2.83} 283`}
                style={{
                  transition: "stroke-dasharray 0.8s ease-in-out",
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-primary-600 dark:text-primary-400">
              {completionPercentage}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          {completenessItems.map((item, index) => (
            <div
              key={index}
              className="checklist-item opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {item.completed ? (
                  <FiCheckCircle className="w-6 h-6 text-green-500 shrink-0 animate-pulse" />
                ) : (
                  <FiXCircle className="w-6 h-6 text-gray-400 shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-gray-700 dark:text-gray-200 ${
                      !item.completed && "opacity-60"
                    }`}
                  >
                    {item.name}
                  </p>
                  {!item.completed && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {
                        [
                          "Add your professional headline",
                          "List your work experience",
                          "Include education history",
                          "Show your certifications",
                          "Add relevant skills",
                        ][index]
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {completionPercentage < 100 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">🚀</span>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Complete your profile to increase visibility by up to 70%
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileStrength;
