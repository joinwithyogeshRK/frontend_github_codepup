import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export default function GitHubDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <div className="relative inline-block w-2">
      {/* GitHub Icon Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
      >
        <SiGithub size={24} color="white" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            GitHub
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Sync your project 2-way with GitHub to collaborate at source.
          </p>
          <div className="flex justify-between gap-18 items-center">
            <div className="mt-4 ">
              <FaQuestionCircle className="size-6 bg-gray-600" />
            </div>
            <div className="mt-4 w-full px-4 py-2 gap-2.5 flex text-white bg-black rounded-lg hover:bg-gray-800 transition">
              <SiGithub size={24} color="white" />
              <button onClick={() => navigate('/realpage') }>
                Connect GitHub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
