import hiringImage from "../../assets/see_who's_hiring.jpg";

const WhosHiringImage = () => {
  return (
    <div className="mt-4 cursor-pointer h-fit">
      <img
        src={hiringImage}
        alt="Promotional Banner"
        className="rounded-lg shadow-lg w-58 aspect-square object-fill object-center"
      />
    </div>
  );
};

export default WhosHiringImage;
