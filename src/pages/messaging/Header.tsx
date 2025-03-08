const Header = () => {
  return (
    <>
      <header className="flex justify-between p-3 pl-5 pr-5 border-1 border-[#e8e8e8] ">
        <div>
          <label htmlFor="searchMessages" className="font-semibold">
            Messaging
          </label>
          <input
            type="text"
            id="searchMessages"
            name="searchMessages"
            placeholder="Search message"
            className="hover:border-black hover:border-2 border-2 border-transparent rounded-sm ml-3 pl-3 bg-[#edf3f7]"
          ></input>
        </div>

        <div>
          <button>hoba </button>
          <button className="ml-1">hob</button>
        </div>
      </header>
    </>
  );
};

export default Header;
