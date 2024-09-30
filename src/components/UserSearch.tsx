import { useState } from "react";
import { useLazyGetAllLoginUserQuery } from "../redux/api/chatApi";

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, { data: users, isLoading, error }] =
    useLazyGetAllLoginUserQuery();
  const handleSearch = () => {
    triggerSearch(searchTerm);
  };
  return (
    <div>
      <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users"
          className="flex-1 px-4 py-2 text-gray-700 bg-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </div>

      {isLoading && <p>Loading...</p>}

      {error && (
        <p>
          Error:{" "}
          {"status" in error
            ? `Status: ${error.status}`
            : error.message || "An error occurred"}
        </p>
      )}

      {users && users.length > 0 ? (
        <ul className="mt-4 bg-white rounded-md shadow-md">
          {users.map((user: User) => (
            <li
              key={user.username}
              className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-100 transition duration-200"
            >
              <div>
                <p className="font-semibold">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm &&
        !isLoading && <p className="mt-2 text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default UserSearch;
