const ViewedSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900  p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
        Viewers also viewed
      </h2>
      <div className="space-y-4">
        {/* List of viewed profiles */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-200">
                John Doe
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Software Engineer
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ViewedSection;
