// components/ContactInfoModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { Link } from "react-router-dom";
import { formatIsoDateToHumanReadable } from "@/utils";
import { FaBirthdayCake, FaPhone, FaGlobe } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { Link as LinkIcon } from "lucide-react";

import type { ContactInfo } from "@/types";

type ContactInfoModalProps = {
  user: {
    contact_info: ContactInfo;
    first_name: string;
    last_name: string;
  };
  triggerLabel: string;
};

export const ContactInfoModal = ({
  user,
  triggerLabel,
}: ContactInfoModalProps) => {
  const { website, birthday, address, phone_number, country_code } =
    user.contact_info;

  // Check if there is any contact info available
  const hasAnyInfo =
    website || birthday || address || phone_number || country_code;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-blue-600 cursor-pointer text-sm font-semibold dark:text-blue-400">
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl underline">
            {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <h2 className="font-bold text-xl">Contact Info</h2>
          {hasAnyInfo ? (
            <>
              {!!phone_number && (
                <ContactInfoItem
                  icon={<FaPhone />}
                  label="Phone Number"
                  value={phone_number !== null ? phone_number : "N/A"}
                />
              )}

              {!!country_code && (
                <ContactInfoItem
                  icon={<FaGlobe />}
                  label="Country Code"
                  value={country_code || "N/A"}
                />
              )}
              {!!website && (
                <ContactInfoItem
                  icon={<LinkIcon />}
                  label="Website"
                  value={website ? <Link to={website}>{website}</Link> : "N/A"}
                />
              )}

              {!!birthday && (
                <ContactInfoItem
                  icon={<FaBirthdayCake />}
                  label="Birthday"
                  value={
                    birthday ? formatIsoDateToHumanReadable(birthday) : "N/A"
                  }
                />
              )}

              {!!address && (
                <ContactInfoItem
                  icon={<CiHome />}
                  label="Address"
                  value={address}
                />
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
              No contact info available
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ContactInfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2">
    <span className="text-gray-500 dark:text-gray-300 mt-1">{icon}</span>
    <div className="grid gap-1">
      <h3 className="font-medium">{label}</h3>
      <p className="text-gray-600 dark:text-gray-300">{value}</p>
    </div>
  </div>
);
