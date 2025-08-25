import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function GitHubOrgDropdown() {
  const [username, setUsername] = useState<string | null>(null);

  // Extract username from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userFromUrl = params.get("username");
    if (userFromUrl) {
      setUsername(userFromUrl);
    }
  }, []);
  console.log(username);
  const navigate = useNavigate()

  const handleClick = () => {
navigate(`/form/?username=${username}`)
  }

  // Close dropdown when clicking outside

  return (
    <div className="absolute right-0 mt-2 w-72 bg-[#111111] text-white rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
      <div className="px-4 py-2 text-sm text-gray-400 font-semibold border-b border-gray-800">
        GitHub Organizations
      </div>

      <div className="h-10 gap-3 flex items-center">
        <img className="size-6 rounded-4xl"
          src="https://avatars.githubusercontent.com/u/219418933?v=4"
          alt="User Avatar"
        />

        <button onClick={handleClick}>{username}</button>
      </div>

      {/* Manage Organizations */}
      <div className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer border-t border-gray-800">
        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400">
          <FiPlus size={16} />
        </div>
        <span className="ml-3 font-medium">Manage Organizations</span>
      </div>
    </div>
  );
}
