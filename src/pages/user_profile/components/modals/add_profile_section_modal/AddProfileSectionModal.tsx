import { Fragment } from "react";
import { Accordion, AccordionItem } from "../../../../../components";
import { CORE_PROFILE_SECTIONS } from "../../../../../constants";
import { useDispatch } from "react-redux";
import Header from "../components/Header";

const AddProfileSectionModal = () => {
  const dispatch = useDispatch();
  return (
    <div className="max-w-5xl md:w-[30rem] w-full">
      <Header title="Add To Profile" />
      <Accordion>
        <AccordionItem title="Core" defaultOpen>
          <p className="text-xs">
            Completing these sections will increase your credibility and give
            you access to more opportunities
          </p>
          <div className="flex flex-col items-start gap-4 pt-3 ">
            {CORE_PROFILE_SECTIONS.map((section, i) => (
              <Fragment key={section.id}>
                <button
                  onClick={() => dispatch(section.onClickEvent)}
                  className="cursor-pointer text-gray-700 font-semibold dark:text-gray-300 "
                >
                  {section.title}
                </button>
                {i !== CORE_PROFILE_SECTIONS.length - 1 && (
                  <div className="w-full h-[0.05rem] bg-black dark:bg-gray-300" />
                )}
              </Fragment>
            ))}
          </div>
        </AccordionItem>
        <AccordionItem title="Recomended">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
          excepturi est asperiores eligendi accusamus unde nam corporis error
          necessitatibus ad!
        </AccordionItem>
        <AccordionItem title="Additional">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint fugit
          tempora commodi totam rerum saepe hic, nam esse aliquid odit.
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddProfileSectionModal;
