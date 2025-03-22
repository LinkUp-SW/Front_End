import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaChevronDown } from "react-icons/fa";
import { COMMENT_SORTING_MENU } from "./menus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/pages/feed/components";
import { Button } from "@/components";
import { Link } from "react-router-dom";
import { CommentType } from "@/types";

export default function PostFooter(
  user: {
    name: string;
    profileImage: string;
    headline?: string;
    followers?: string;
    degree: string;
  },
  sortingMenu: boolean,
  setSortingMenu: React.Dispatch<React.SetStateAction<boolean>>,
  sortingState: string,
  handleSortingState: () => void,
  comments: CommentType[]
) {
  return (
    <section className="flex flex-col w-full gap-4">
      <div className="flex gap-1 z-10 overflow-x-clip">
        {[
          "I appreciate this!",
          "Congratulations!",
          "Useful takeaway",
          "I appreciate this!",
          "Congratulations!",
          "Useful takeaway",
          "I appreciate this!",
          "Congratulations!",
          "Useful takeaway",
        ].map((text) => (
          <Button
            variant={"outline"}
            className="bg-transparent light:border-gray-600 light:hover:border-2 dark:hover:text-neutral-200 dark:hover:bg-transparent hover:cursor-pointer dark:text-blue-300 dark:border-blue-300 rounded-full"
          >
            {text}
          </Button>
        ))}
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex space-x-3 justify-start items-between">
          <Link to={"#"}>
            <Avatar className="h-8 w-8 pl-0">
              <AvatarImage src={user.profileImage} alt="Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <input
            placeholder="Add a comment..."
            className="w-full h-11 border p-4 focus:ring-1 transition-colors hover:text-gray-950 dark:hover:text-neutral-200 rounded-full border-gray-400 font-medium text-black focus:outline-none text-left dark:text-neutral-300"
          ></input>
        </div>
      </div>
      <div className="flex relative -left-5">
        <Popover open={sortingMenu} onOpenChange={setSortingMenu}>
          <PopoverTrigger className="rounded-full dark:hover:bg-zinc-700 hover:cursor-pointer dark:hover:text-neutral-200 h-8 gap-1.5 px-3 has-[>svg]:px-2.5">
            <div className="flex items-center gap-1 text-gray-500 text-sm font-medium ">
              <p>{sortingState}</p>
              <FaChevronDown />{" "}
            </div>
          </PopoverTrigger>
          <PopoverContent className="relative dark:bg-gray-900 bg-white border-neutral-200 dark:border-gray-700 p-0 pt-1">
            <div className="flex flex-col w-full p-0">
              {COMMENT_SORTING_MENU.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    handleSortingState();
                    setSortingMenu(false);
                  }}
                  className="flex justify-start items-center rounded-none bg-transparent w-full h-16 pt-4 py-4 hover:bg-neutral-200 text-gray-900 dark:text-neutral-200 dark:hover:bg-gray-600 hover:cursor-pointer"
                >
                  <div className="flex justify-start w-full text-gray-600">
                    <div className="p-4 pl-0">{item.icon}</div>
                    <div className="flex flex-col items-start justify-center text-wrap text-start">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs">{item.subtext}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col relative -left-1 -top-3">
        {comments.map((data, index: number) => (
          <Comment
            key={index}
            user={data.user}
            comment={data.comment}
            stats={data.stats}
          />
        ))}
      </div>
    </section>
  );
}
