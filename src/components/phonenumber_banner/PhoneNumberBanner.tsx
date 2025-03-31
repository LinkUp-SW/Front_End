import { Button, DialogContent , Dialog, DialogTrigger } from "@/components"; // Adjust the import path as needed

const PhoneNumberBanner = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between -mt-2 mb-2 items-center border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 px-4 py-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <span className="text-gray-800 dark:text-gray-200 text-sm md:text-base font-medium mb-3 sm:mb-0">
        It looks like you don't have a phone number or it isn't verified.
      </span>
      <Dialog>
        <DialogTrigger asChild>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer sm:w-fit w-full">
        Add / Verify Phone Number
      </Button>
        </DialogTrigger>
      <DialogContent>
jwll
      </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneNumberBanner;
