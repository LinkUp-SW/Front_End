import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormInput,
  FormTextarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { COUNTRY_CITY_MAP } from "@/constants";
import { Bio, BioFormData, Organization } from "@/types";
import { Dialog } from "@radix-ui/react-dialog";
import { useState, ChangeEvent } from "react";
import EditContactInfoModal from "./EditContactInfoModal";
import { updateUserBio } from "@/endpoints/userProfile";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { editUserBio } from "@/slices/user_profile/userBioSlice";
import { validateName } from "@/utils";

type EditUserBioModalProps = {
  userId: string;
  userData: Bio;
  intros: {
    work_experience: Organization | null;
    education: Organization | null;
  };
  setOpenEditDialog: (open: boolean) => void;
};

const EditUserBioModal: React.FC<EditUserBioModalProps> = ({
  userData,
  setOpenEditDialog,
}) => {
  const authToken = Cookies.get("linkup_auth_token");
  const [formData, setFormData] = useState<BioFormData>({
    first_name: userData.first_name,
    last_name: userData.last_name,
    headline: userData.headline ?? "",
    location: {
      country_region: userData.location.country_region,
      city: userData.location.city,
    },
    contact_info: {
      phone_number: userData.contact_info.phone_number ?? 0,
      address: userData.contact_info.address ?? "",
      birthday: userData.contact_info.birthday ?? "",
      website: userData.contact_info.website ?? "",
      country_code: userData.contact_info.country_code ?? "",
    },
    website: "",
  });
  const [openContactInfoModal, setOpenContactInfoModal] = useState(false);
  const userBio = useSelector((state: RootState) => state.userBio.data);
  const dispatch = useDispatch();
  // Generic input/textarea change
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: value,
        } as Pick<BioFormData, keyof BioFormData>)
    );
  };

  // Country select change resets city
  const handleCountryChange = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { country_region: country, city: "" },
    }));
  };

  // City select change
  const handleCityChange = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, city },
    }));
  };

  // Contact info fields change
  const handleContactInfoChange = (
    field: keyof BioFormData["contact_info"],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value },
    }));
  };

  const validateUserBioForm = () => {
    if (formData.first_name.trim() === "") {
      return "First Name is required!";
    }
    if (formData.last_name.trim() === "") {
      return "Last Name is required!";
    }
    if (formData.headline.trim() === "") {
      return "Headline is required!";
    }
    if (formData.location.city.trim() === "") {
      return "Please choose a city!";
    }
    if (formData.location.country_region.trim() === "") {
      return "Please choose a country!";
    }

    if (!validateName(formData.first_name)) {
      return "Please enter a valid first name (up to 15 characters, no special characters).";
    }
    if (!validateName(formData.last_name)) {
      return "Please enter a valid last name (up to 15 characters, no special characters).";
    }

    return null;
  };

  const handleUpdateUserBio = async () => {
    if (!authToken)
      return toast.error("You are unauthorized to do this action");
    if (validateUserBioForm()) {
      return toast.error(validateUserBioForm());
    }
    try {
      const response = await updateUserBio(authToken, formData);
      setOpenEditDialog(false);
      dispatch(editUserBio({ ...userBio, bio: response.user }));
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <FormInput
        label="First Name*"
        placeholder="John"
        id="first-name"
        name="first_name"
        value={formData.first_name}
        onChange={handleInputChange}
        limit={15}
      />
      <FormInput
        label="Last Name*"
        placeholder="Doe"
        id="last-name"
        name="last_name"
        value={formData.last_name}
        onChange={handleInputChange}
        limit={15}
      />
      <FormTextarea
        label="Headline*"
        placeholder="Write a brief and compelling summary about yourself"
        maxLength={200}
        id="profile-headline"
        name="headline"
        value={formData.headline}
        onChange={handleInputChange}
      />

      <h2 className="text-xl font-bold">Location*</h2>
      <section className="flex py-5 sm:flex-row flex-col gap-2">
        <Select
          value={formData.location.country_region}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger
            id="country"
            name="country_region"
            className="flex-grow w-full border-gray-600 outline-gray-600"
          >
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {Object.keys(COUNTRY_CITY_MAP).map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={formData.location.city}
          onValueChange={handleCityChange}
          disabled={!formData.location.country_region}
        >
          <SelectTrigger
            id="city"
            name="city"
            className="flex-grow w-full border-gray-600 outline-gray-600"
          >
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white">
            {formData.location.country_region &&
              COUNTRY_CITY_MAP[formData.location.country_region].map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </section>

      <div>
        <h2 className="text-xl font-bold">Contact Info</h2>
        <p className="text-xs font-semibold">
          Add or edit your email, phone number, and more.
        </p>
        <EditContactInfo
          contactInfoData={formData.contact_info}
          handleUserBioChange={handleContactInfoChange}
          openContactInfoModal={openContactInfoModal}
          setOpenContactInfoModal={setOpenContactInfoModal}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold">Website</h2>
        <p className="text-xs font-semibold mb-[-1rem]">
          Add a link that will help people know you better
        </p>
        <FormInput
          placeholder="Ex: portfolio"
          label=""
          id="website"
          name="website"
          value={formData.contact_info.website}
          onChange={(e) => handleContactInfoChange("website", e.target.value)}
        />
      </div>
      <footer className="w-full flex gap-2 mt-4 justify-end">
        <button
          type="button"
          id="close-edit-bio-btn"
          onClick={() => setOpenEditDialog(false)}
          className="destructiveBtn px-2 py-1.5 rounded-xl font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          id="update-bio-btn"
          onClick={handleUpdateUserBio}
          className="affirmativeBtn px-4 font-semibold text-white py-1.5 rounded-xl"
        >
          Update
        </button>
      </footer>
    </div>
  );
};

interface EditContactInfoProps {
  contactInfoData: BioFormData["contact_info"];
  handleUserBioChange: (
    field: keyof BioFormData["contact_info"],
    value: string | number
  ) => void;
  openContactInfoModal: boolean;
  setOpenContactInfoModal: (open: boolean) => void;
}

const EditContactInfo: React.FC<EditContactInfoProps> = ({
  contactInfoData,
  handleUserBioChange,
  openContactInfoModal,
  setOpenContactInfoModal,
}) => (
  <Dialog open={openContactInfoModal} onOpenChange={setOpenContactInfoModal}>
    <DialogTrigger asChild>
      <button
        id="edit-contact-info-btn"
        className="w-fit py-1.5 my-4 px-4 border-2 rounded-full dark:border-blue-400 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out border-blue-600 cursor-pointer"
      >
        Edit Contact Info
      </button>
    </DialogTrigger>
    <DialogContent
      aria-describedby={undefined}
      className="!max-w-5xl md:!w-[40rem] dark:bg-gray-900 dark:border-gray-600 !w-full border-2"
    >
      <DialogHeader>
        <DialogTitle>Edit Contact Info</DialogTitle>
      </DialogHeader>
      <EditContactInfoModal
        contactInfoData={contactInfoData}
        handleUserBioChange={handleUserBioChange}
        setOpenContactInfoModal={setOpenContactInfoModal}
      />
    </DialogContent>
  </Dialog>
);

export default EditUserBioModal;
