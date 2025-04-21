import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SortDropdown = () => {
  const [selected, setSelected] = useState("Top");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-4 pb-2">
      <div className="border-b-2 border-b-gray-300 relative bottom-2.5 grow"></div>
      <div className="flex justify-end items-center space-x-1 text-sm text-muted-foreground">
        <span>Sort by:</span>
        <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-6 px-2 py-0 text-sm font-semibold"
            >
              {selected}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-28 p-1">
            {["Top", "Recent"].map((option) => (
              <button
                key={option}
                onClick={() => {
                  handleSelect(option);
                }}
                className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-accent ${
                  selected === option
                    ? "font-semibold text-primary border-l-gray-950 border-l-2 rounded-none"
                    : ""
                }`}
              >
                {option}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SortDropdown;
