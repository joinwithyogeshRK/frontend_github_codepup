import { useState, useEffect } from "react";
 
import GitHubOrgDropdown from "../components/GitHubDropdown";
import { GithubLogo } from "phosphor-react";
import Cookies from "js-cookie";

// Types
interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
}

export default function RealPage() {
  // State management
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [zipUrl, setZipUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
 
 

  // Loading states
  const [isConnectingProject, setIsConnectingProject] =
    useState<boolean>(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState<boolean>(false);
  const [isConnectingGitHub, setIsConnectingGitHub] = useState<boolean>(false);

  // Project connection state
  const [projectConnected, setProjectConnected] = useState<boolean>(false);

  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

  // Handle GitHub account disconnect
  const handleDisconnect = async () => {
    try {
      // Optional: Call backend to revoke GitHub access
      // await fetch("http://localhost:7071/api/RevokeAccess", {
      //   method: "POST",
      //   credentials: "include",
      // });

      // Clear frontend state
      setUser(null);
      setUsername(null);
      setConnected(false);
      setProjectConnected(false);
      setRepoUrl(null);

      // Remove cookies
     

      alert("Successfully disconnected from GitHub");
    } catch (err) {
      console.error("Disconnect error:", err);
      alert("Failed to disconnect");
    }
  };

  // Handle project connection/upload
  const handleProjectSubmit = async (isUpdate = false) => {
    if (!username) {
      alert("Please connect your GitHub account first");
      return;
    }

    if (!zipUrl.trim() || !repoName.trim()) {
      alert("Please provide both ZIP URL and repository name");
      return;
    }

    if (isUpdate) {
      setIsUpdatingProject(true);
    } else {
      setIsConnectingProject(true);
    }

    try {
      const response = await fetch(
        " https://yogeshguraniazuretest-cqdzdzbrfxfhfsea.centralindia-01.azurewebsites.net/api/queuesubmit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username,
            zipUrl: zipUrl.trim(),
            repoName: repoName.trim(),
            isUpdate,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          errorData || `${isUpdate ? "Update" : "Upload"} failed`
        );
      }

      const data = await response.json();
      console.log(`${isUpdate ? "Update" : "Upload"} response:`, data);

      setRepoUrl(data.repoUrl);
      setConnected(true);
      setProjectConnected(true);

      alert(`✅ ${isUpdate ? "Update" : "Upload"} successful`);
    } catch (err) {
      console.error(`${isUpdate ? "Update" : "Upload"} error:`, err);
      alert(`❌ ${isUpdate ? "Update" : "Upload"} failed: ${err.message}`);
    } finally {
      if (isUpdate) {
        setIsUpdatingProject(false);
      } else {
        setIsConnectingProject(false);
      }
    }
  };

  const handleOrgSelect = (org: string): void => {
    console.log("Selected org:", org);
    setShowDropdown(false);
  };

  // Handle GitHub OAuth login
  const handleLogin = async () => {
    setIsConnectingGitHub(true);
    try {
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=read:user repo workflow`;
      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error("Login error:", error);
      setIsConnectingGitHub(false);
      alert("Failed to initiate GitHub login");
    }
  };

  // Fetch GitHub user info
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        "https://yogeshguraniazuretest-cqdzdzbrfxfhfsea.centralindia-01.azurewebsites.net/api/myinformation",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();
      console.log("GitHub user data:", data);

      setUser(data);
      setUsername(data.login);
      setIsConnectingGitHub(false);
    } catch (err) {
      console.error("Error fetching GitHub user:", err);
      setUser(null);
      setUsername(null);
      setConnected(false);
      setProjectConnected(false);
      setIsConnectingGitHub(false);
      Cookies.remove("github_username");
      Cookies.remove("authUsername");
    }
  };

  // Handle OAuth callback and initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Coming back from GitHub OAuth
      setIsConnectingGitHub(true);
      fetchUserInfo();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Normal page load - check existing authentication
      fetchUserInfo();
    }
  }, []);

  // Copy to clipboard helper
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("❌ Failed to copy to clipboard");
    }
  };

  return (
    <div className="h-10/12 w-11/12 mt-10">
      <div className="bg-[#0b0b0b] text-white antialiased">
        <div className="max-w-screen-2xl flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0 bg-[#111214] border-r border-gray-800">
            <div className="h-full flex flex-col justify-between py-6 px-5">
              <div>
                <section>
                  <h3 className="text-gray-400 uppercase text-[11px] tracking-wider mb-4">
                    Project
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <SidebarItem>Project Settings</SidebarItem>
                    <SidebarItem>Domains</SidebarItem>
                    <SidebarItem>Analytics</SidebarItem>
                    <SidebarItem>Knowledge</SidebarItem>
                  </nav>
                </section>

                <section className="mb-2 mt-6">
                  <h3 className="text-gray-400 uppercase text-[11px] tracking-wider mb-4">
                    Workspace
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <SidebarItem strong>Yogesh's Lovable</SidebarItem>
                    <SidebarItem>People</SidebarItem>
                    <SidebarItem>Plans & Billing</SidebarItem>
                  </nav>
                </section>

                <section className="mb-6 mt-6">
                  <h3 className="text-gray-400 uppercase text-[11px] tracking-wider mb-4">
                    Account
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <SidebarItem>Yogesh Gurani</SidebarItem>
                    <SidebarItem>Labs</SidebarItem>
                  </nav>
                </section>

                <section>
                  <h3 className="text-gray-400 uppercase text-[11px] tracking-wider mb-4">
                    Integrations
                  </h3>
                  <nav className="flex flex-col gap-1">
                    <IntegrationItem>
                      <SupabaseLogo className="w-5 h-5" />
                      <span>Supabase</span>
                    </IntegrationItem>

                    <IntegrationItem active>
                      <GithubLogo className="w-5 h-5" />
                      <span>GitHub</span>
                    </IntegrationItem>
                  </nav>
                </section>
              </div>

              <div className="text-gray-500 text-sm">
                <div className="mb-1">v1.0</div>
                <div className="text-xs text-gray-600">Made with ❤️</div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 lg:p-10">
            <div className="w-full mx-auto">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-semibold">GitHub</h1>
                  <p className="text-gray-400 mt-1">
                    Sync your project 2-way with GitHub to collaborate at
                    source.
                  </p>
                </div>

                <a
                  href="#"
                  className="text-sm text-gray-400 hover:underline mr-4 ml-6 mt-1"
                >
                  Docs
                </a>
              </div>

              {/* Sections container */}
              <div className="mt-8 space-y-8">
                {/* Connect Project Section */}
                {projectConnected ? (
                  <section className="bg-transparent border-b border-gray-800 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                          Project
                          <span className="bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            Connected
                          </span>
                        </h3>
                        <p className="text-gray-400 text-sm mt-1 max-w-md">
                          Your project is synced with GitHub. You can view it or
                          update it.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        {repoUrl && (
                          <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                          >
                            View on GitHub&nbsp;
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="inline-block h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={() => handleProjectSubmit(true)}
                          disabled={isUpdatingProject || !username}
                          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white transition"
                        >
                          <GithubLogo className="w-4 h-4" weight="fill" />
                          <span>
                            {isUpdatingProject
                              ? "Updating..."
                              : "Update Project"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="bg-transparent border-b border-gray-800 pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-medium">Connect Project</h2>
                        <p className="text-gray-500 mt-2 max-w-[680px] text-sm leading-5">
                          Connect your project to your GitHub organization in a
                          2-way sync.
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-2 relative">
                        <button
                          onClick={() => handleProjectSubmit(false)}
                          disabled={isConnectingProject || !username}
                          className="inline-flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium bg-[#0f1720] border border-gray-800 hover:bg-[#121619] disabled:bg-gray-700 disabled:cursor-not-allowed transition"
                        >
                          <GithubLogo className="w-4 h-4" weight="fill" />
                          <span>
                            {isConnectingProject
                              ? "Connecting..."
                              : "Connect Project"}
                          </span>
                        </button>

                        {showDropdown && (
                          <GitHubOrgDropdown
                            onSelect={handleOrgSelect}
                            onClose={() => setShowDropdown(false)}
                          />
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* GitHub Account Connection Section */}
                {username && user ? (
                  <section className="bg-transparent border-b border-gray-800 pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          Connected Account
                          <span className="px-2 py-0.5 text-xs rounded-md bg-green-600 text-white font-medium">
                            Admin
                          </span>
                        </h3>
                        <p className="text-gray-500 mt-2 max-w-[680px] text-sm leading-5">
                          Your GitHub account is connected and ready to use.
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-[#2d2d2d] hover:bg-[#383838] text-white px-4 py-2 rounded-md transition no-underline"
                        >
                          <img
                            src={user.avatar_url}
                            alt={`${username}'s avatar`}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium">
                            {username}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>

                        <button
                          onClick={handleDisconnect}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="bg-transparent border-b border-gray-800 pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-medium flex items-center gap-2">
                          Connected Account
                          <span className="px-2 py-0.5 text-xs rounded-md bg-yellow-700 text-white font-medium">
                            Admin
                          </span>
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-[680px] text-sm leading-5">
                          Add your GitHub account to manage connected
                          organizations.
                        </p>
                      </div>

                      <button
                        onClick={handleLogin}
                        disabled={isConnectingGitHub}
                        className="bg-white hover:bg-gray-200 disabled:bg-gray-400 text-black px-6 py-2 rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed"
                      >
                        {isConnectingGitHub
                          ? "Connecting..."
                          : "Connect with GitHub"}
                      </button>
                    </div>
                  </section>
                )}
              </div>

              {/* Clone Repository Section */}
              {repoUrl && (
                <div className="border border-gray-700 rounded-md p-4 mt-8 w-full max-w-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Clone Repository
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Copy this repository to your local environment.
                  </p>

                  <div className="flex items-center space-x-4 text-sm mb-3">
                    <span className="text-white font-medium">HTTPS</span>
                    <span className="text-gray-400 hover:text-white cursor-pointer">
                      SSH
                    </span>
                    <span className="text-gray-400 hover:text-white cursor-pointer">
                      GitHub CLI
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${repoUrl}.git`}
                      className="flex-1 bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => copyToClipboard(`${repoUrl}.git`)}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 transition"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Project Configuration Section */}
      <div className="flex flex-col gap-6 justify-center items-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-800 to-black text-white px-6">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            GitHub Auto Uploader 🚀
          </h1>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="zipUrl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                ZIP File URL
              </label>
              <input
                id="zipUrl"
                type="url"
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/project.zip"
                value={zipUrl}
                onChange={(e) => setZipUrl(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="repoName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Repository Name
              </label>
              <input
                id="repoName"
                type="text"
                className="w-full p-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="my-awesome-project"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
            </div>
          </div>

          {!username && (
            <div className="text-center p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <p className="text-yellow-200 text-sm">
                ⚠️ Please connect your GitHub account first to upload projects
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component interfaces and helper components
interface SidebarItemProps {
  children: React.ReactNode;
  strong?: boolean;
}

function SidebarItem({ children, strong = false }: SidebarItemProps) {
  return (
    <button
      className={`w-full text-left px-2 py-2 rounded-md text-sm ${
        strong ? "text-white font-medium" : "text-gray-300"
      } hover:text-white transition-colors`}
    >
      {children}
    </button>
  );
}

interface IntegrationItemProps {
  children: React.ReactNode;
  active?: boolean;
}

function IntegrationItem({ children, active = false }: IntegrationItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm ${
        active ? "bg-[#0f1314] text-white" : "text-gray-300"
      }`}
    >
      {children}
    </div>
  );
}

interface IconProps {
  className?: string;
}

function GitHubLogo({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function SupabaseLogo({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
    </svg>
  );
}
