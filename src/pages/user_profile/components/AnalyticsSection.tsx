
const AnalyticsSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900  p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="space-y-4">
        <div>
          <p className="font-medium">Profile views</p>
          <p className="text-blue-600 font-bold">6</p>
        </div>
        <div>
          <p className="font-medium">Post impressions</p>
          <p className="text-blue-600 font-bold">7</p>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
