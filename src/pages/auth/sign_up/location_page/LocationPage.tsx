import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  UserAuthLayout,
} from "@/components";

const LocationPage = () => {
  return (
    <main className="flex min-h-full w-full max-w-md flex-col justify-center relative pt-4">
      <header className="sm:w-full flex flex-col gap-2 items-center">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome, What's Your Location
        </h2>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
          see people, jobs, and news in your area
        </p>
      </header>
      <section className="flex py-5 sm:flex-row flex-col gap-2">
        <Select>
          <SelectTrigger className="flex-grow w-full border-gray-600 outline-gray-600">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"></SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="flex-grow w-full border-gray-600 outline-gray-600">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"></SelectContent>
        </Select>
      </section>
    </main>
  );
};

export default UserAuthLayout(LocationPage);
