interface HeaderProps {
  title: string;
}
const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="flex flex-col mb-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="w-full bg-gray-800 dark:bg-gray-300 h-[0.1rem] rounded-2xl" />
  </header>
);

export default Header;
