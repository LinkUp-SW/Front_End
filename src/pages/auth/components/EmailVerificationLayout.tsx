import { FC, ReactNode } from "react";
import linkUpLogo from "@/assets/link_up.png";

interface EmailVerificationLayoutProps {
  children: ReactNode;
}

const EmailVerificationLayout: FC<EmailVerificationLayoutProps> = ({
  children,
}) => {
  return (
    <main className="min-h-[100dvh] dark:bg-gray-900 flex flex-col w-full md:px-20 px-5 pt-5 md:pt-10">
      <header className="w-full flex">
        <img
          src={linkUpLogo}
          alt="link-up-logo"
          className="w-40 object-contain dark:invert"
        />
      </header>
      <section className="w-full h-full flex items-center justify-center md:py-20 py-18">
        {children}
      </section>
    </main>
  );
};

export default EmailVerificationLayout;
