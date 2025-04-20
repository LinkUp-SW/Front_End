import whoIsHiringImage from "@/assets/whoIsHiring.jpg";
const WhosHiringImage = () => {
  return (
    <div className="mt-4 cursor-pointer h-fit">
      <img
        src={whoIsHiringImage}
        alt="Promotional Banner"
        className="rounded-lg shadow-lg w-58 aspect-square object-fill object-center"
      />
    </div>
  );
};

export default WhosHiringImage;
