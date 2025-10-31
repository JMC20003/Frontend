export const TabsBar = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-3 py-1 text-sm border-b-2 border-gray-400 cursor-pointer 
          ${tab.label.length === 0 ? "hidden" : ""}
          ${
            activeTab === tab.key
              ? "border-sky-500 text-sky-600 font-medium"
              : "border-transparent text-gray-600 hover:text-sky-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
