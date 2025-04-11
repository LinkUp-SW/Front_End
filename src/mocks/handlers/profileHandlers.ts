import { ProfileCardType } from "@/types";
import { createGetHandler } from "../handler_wrapper/getHandler";

const MOCK_PROFILE: ProfileCardType = {
  coverImage:
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  profileImage: "https://github.com/shadcn.png",
  name: "Amr Doma",
  headline:
    "Ex-SWE Intern at Valeo | Ex-Clinical Engineering Intern at As-Salam International Hospital",
  location: "Qesm el Maadi, Cairo",
  university: "Cairo University",
};

// Profile
export const profileHandlers = [
  createGetHandler<ProfileCardType>("/api/profile", () => MOCK_PROFILE),
];
