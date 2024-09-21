const Sidebar = () => {
  return (
    <div className="w-1/3 bg-gray-100 p-4">
      <div className="flex items-center mb-4">
        <div className="flex-grow text-lg font-semibold">John Doe</div>
        <button className="text-purple-600 hover:text-purple-800">i</button>
      </div>
      <div className="bg-purple-200 p-3 rounded-lg mb-2 cursor-pointer">
        <div className="font-semibold">Jane Doe 2</div>
        <div className="text-sm">Hello Jane!</div>
      </div>
    </div>
  );
};

export default Sidebar;
