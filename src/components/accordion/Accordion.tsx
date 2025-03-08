import React, { useState, useRef, useEffect, ReactNode } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  /** Set this prop on an item that should be open by default */
  defaultOpen?: boolean;
  /** Controlled open state passed from the Accordion */
  isOpen?: boolean;
  /** Click handler passed from the Accordion */
  onClick?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onClick = () => {},
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-5 text-slate-800 dark:text-slate-100 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold">{title}</span>
        <span className="transition-transform duration-300">
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="pb-5 text-sm text-slate-500 dark:text-slate-400">
          {children}
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  // Convert children to an array of elements.
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<AccordionItemProps>[];

  // Find the index of the first child with defaultOpen=true.
  const initialActiveIndex = childrenArray.findIndex(
    (child) => child.props.defaultOpen
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(
    initialActiveIndex === -1 ? null : initialActiveIndex
  );

  const handleItemClick = (index: number) => {
    // If the clicked item is already active, toggle it closed; otherwise, open it.
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      {childrenArray.map((child, index) =>
        React.cloneElement(child, {
          isOpen: activeIndex === index,
          onClick: () => handleItemClick(index),
        })
      )}
    </div>
  );
};
