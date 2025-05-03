import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";

const SubscriptionBillingPage = () => {
  return (
    <SettingsLayoutPage>
      <div className="py-10 px-4 m-0 space-y-6">
        <div className="w-full max-w-[790px] mx-auto rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden p-0 bg-white dark:bg-gray-800 border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
          <h2 className="py-4 px-6 m-0 text-xl font-semibold text-[rgba(0,0,0,0.9)] dark:text-[rgba(255,255,255,0.87)] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.12)]">
            Visibility of your profile and Messaging
          </h2>
        </div>
      </div>
    </SettingsLayoutPage>
  );
};

export default SubscriptionBillingPage;
