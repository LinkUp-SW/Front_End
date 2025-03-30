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
import { FaBirthdayCake } from "react-icons/fa";
import { CiHome } from "react-icons/ci";

import type { ContactInfo } from "@/types";
import { Link as LinkIcon } from "lucide-react";

type ContactInfoModalProps = {
  user: {
    contact_info: ContactInfo;
    website: string;
    first_name: string;
    last_name: string;
  };
  triggerLabel: string;
};

export const ContactInfoModal = ({
  user,
  triggerLabel,
}: ContactInfoModalProps) => (
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
        <ContactInfoItem
          icon={<LinkIcon />}
          label="Website"
          value={<Link to={user.website}>{user.website}</Link>}
        />
        {user.contact_info.birthday&&<ContactInfoItem
          icon={<FaBirthdayCake />}
          label="Birthday"
          value={formatIsoDateToHumanReadable(user.contact_info.birthday)}
        />}
        
        <ContactInfoItem
          icon={<CiHome />}
          label="Address"
          value={user.contact_info.address}
        />
      </div>
    </DialogContent>
  </Dialog>
);

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
