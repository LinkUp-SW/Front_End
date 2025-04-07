// LinkUpLoader.tsx
import styles from "./LinkUpLoaderStyles.module.css";
const LinkUpLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex justify-center items-center relative">
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>

        <div>
          <img
            src={"/link_up_logo.png"}
            alt="Link Up Logo"
            className="w-12 mt-1 animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default LinkUpLoader;
