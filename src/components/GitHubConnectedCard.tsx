import { SiGithub } from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";

export default function GitHubConnectedCard() {
  return (
    <div className="w-80 bg-[#111111] text-white rounded-xl border border-gray-700 shadow-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">GitHub</h2>
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-sm text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
            Connected
          </span>
        </div>
      </div>

      {/* Repo link */}
      <div className="flex items-center justify-between bg-transparent p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
        <div className="flex items-center space-x-2">
          <SiGithub size={20} />
          <span className="text-sm font-medium">
            joinwithyogeshRK/artscape-explore
          </span>
        </div>
        <FiExternalLink size={16} />
      </div>

      {/* Edit in VS Code */}
      <div className="flex items-center justify-between bg-transparent p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
        <div className="flex items-center space-x-2">
          <span className="text-xl">&lt;/&gt;</span>
          <span className="text-sm font-medium">Edit in VS Code</span>
        </div>
        <FiExternalLink size={16} />
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <button className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-500 text-gray-400 text-xs">
          ?
        </button>
        <button className="px-4 py-1 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition">
          Configure
        </button>
      </div>
    </div>
  );
}
