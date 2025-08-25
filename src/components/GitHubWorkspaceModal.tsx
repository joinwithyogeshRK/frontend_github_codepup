 

export default function GithubWorkspaceModal() {
  return (
    <div className="w-[700px] bg-[#1E1E1E] text-white rounded-xl shadow-lg p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Link your workspace to GitHub
          <span className="bg-yellow-800 text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-md">
            Admin
          </span>
        </h2>
        <button className="text-gray-400 hover:text-gray-200 text-xl">
          &times;
        </button>
      </div>

      {/* Subtext */}
      <p className="text-sm text-gray-400">
        Anyone in your Lovable workspace can add Lovable projects to GitHub
        organizations.
      </p>

      {/* Workspace and GitHub Organizations */}
      <div className="flex justify-between items-start bg-[#121212] rounded-lg p-4">
        {/* Workspace */}
        <div>
          <h3 className="text-xs text-gray-400 mb-2">Workspace</h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              M
            </div>
            <span className="text-white font-medium">My Lovable</span>
          </div>
        </div>

        {/* GitHub Organizations */}
        <div className="flex flex-col items-end">
          <h3 className="text-xs text-gray-400 mb-2">GitHub Organizations</h3>
          <button className="bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-200">
            Add Organizations
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-start">
        <button className="bg-gray-700 text-gray-400 px-5 py-2 rounded-lg font-medium cursor-not-allowed">
          Continue
        </button>
      </div>
    </div>
  );
}
