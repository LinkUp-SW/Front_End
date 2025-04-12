import { Experience } from "@/types";
import ExperienceActionButtons from "./ExperienceActionButtons";

interface ExperienceHeaderSectionProps {
  isEmpty: boolean;
  isMe: boolean;
  onAddExperience: (exp: Experience) => void;
}

const ExperienceHeaderSection: React.FC<ExperienceHeaderSectionProps> = ({
  isEmpty,
  isMe,
  onAddExperience,
}) => (
  <header
    id="experience-section-header"
    className={`flex justify-between items-center mb-4 ${
      isEmpty ? "opacity-65" : ""
    }`}
  >
    <div id="experience-section-title-container">
      <h2
        id="experience-section-title"
        className="text-xl text-black dark:text-white font-bold"
      >
        Experiences
      </h2>
      {isEmpty && isMe && (
        <p id="experience-section-description" className="text-sm">
          Showcase your accomplishments and get up to 2X as many profile views
          and connections
        </p>
      )}
    </div>
    {/* Only show "+ Add Experience" button if user is the owner and the list is not empty */}
    {!isEmpty && isMe && (
      <ExperienceActionButtons onAddExperience={onAddExperience} />
    )}
  </header>
);

export default ExperienceHeaderSection;
