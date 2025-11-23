import { useEffect, useState } from "react";

import { API_BASE } from "../config";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [health, setHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  async function fetchLinks() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/links`);
      const data = await res.json();
      setLinks(data);
    } finally {
      setLoading(false);
    }
  }

  async function checkHealth() {
    try {
      setCheckingHealth(true);
      const res = await fetch(`${API_BASE}/healthz/getHealthz`);
      const data = await res.json();
      setHealth(data);
      setShowHealthModal(true);
    } catch (err) {
      alert("Healthcheck failed: " + err.message);
    } finally {
      setCheckingHealth(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function createShort(e) {
    e.preventDefault();

    const body = { url };
    if (code.trim()) body.code = code.trim();

    const res = await fetch(`${API_BASE}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Short Link: " + data.shortUrl);
    fetchLinks();
    setUrl("");
    setCode("");
  }

  async function deleteLink(linkCode) {
    if (!confirm("Are you sure you want to delete this link?")) return;
    
    await fetch(`${API_BASE}/api/links/${linkCode}`, {
      method: "DELETE",
    });
    fetchLinks();
  }

  function copyToClipboard(text, linkCode) {
    navigator.clipboard.writeText(text);
    setCopiedCode(linkCode);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <div className="w-full flex-1 px-6 sm:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 flex flex-col">
        <div className="flex justify-between items-start mb-8 sm:mb-12">
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              TinyLink
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Shorten, manage, and track your links</p>
          </div>
          <button
            onClick={checkHealth}
            disabled={checkingHealth}
            className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:shadow-md hover:border-blue-300 transition-all disabled:opacity-50"
            title="Check Server Health"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {checkingHealth ? "Checking..." : "Health"}
          </button>
        </div>
        <div className="sm:hidden mb-6">
          <button
            onClick={checkHealth}
            disabled={checkingHealth}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:shadow-md hover:border-blue-300 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {checkingHealth ? "Checking..." : "Check Server Health"}
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            Create Short Link
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Long URL
              </label>
              <input
                type="url"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Code <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="my-custom-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <button 
              onClick={createShort}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Create Short Link
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              Your Links
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({links.length})
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-2">No links yet</p>
              <p className="text-gray-400 text-sm">Create your first short link to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              {/* Desktop Table */}
              <table className="w-full hidden md:table">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Target URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {links.map((l) => (
                    <tr key={l.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`/code/${l.code}`}
                          className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                        >
                          {l.code}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`${API_BASE}/${l.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:underline"
                          >
                            {API_BASE}/{l.code}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <button
                            onClick={() => copyToClipboard(`${API_BASE}/${l.code}`, l.code)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedCode === l.code ? (
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={l.target_url}>
                          {l.target_url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
                          {l.total_clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteLink(l.code)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {links.map((l) => (
                  <div key={l.code} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <a
                        href={`/code/${l.code}`}
                        className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                      >
                        {l.code}
                      </a>
                      <span className="text-sm font-semibold text-gray-900">
                        {l.total_clicks.toLocaleString()} clicks
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`${API_BASE}/${l.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:underline"
                        >
                          {API_BASE}/{l.code}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <button
                          onClick={() => copyToClipboard(`${API_BASE}/${l.code}`, l.code)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedCode === l.code ? (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-600 truncate">
                        {l.target_url}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteLink(l.code)}
                      className="w-full inline-flex items-center justify-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Modal */}
      {showHealthModal && health && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowHealthModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Server Health</h2>
                    <p className="text-blue-100 text-sm">System Status & Metrics</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHealthModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Card */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">Status</p>
                    <p className="text-lg font-bold text-green-900">{health.status}</p>
                  </div>
                </div>
              </div>

              {/* Version & Uptime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-600 mb-1">Version</p>
                  <p className="text-2xl font-bold text-blue-900">{health.version}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-purple-600 mb-1">Uptime</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {health.uptime?.minutes || health.uptime || 'N/A'} min
                  </p>
                </div>
              </div>

              {/* System Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  System Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Platform</p>
                    <p className="font-semibold text-gray-900">{health.system.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Architecture</p>
                    <p className="font-semibold text-gray-900">{health.system.architecture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CPU Cores</p>
                    <p className="font-semibold text-gray-900">{health.system.cpu_cores}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Node Version</p>
                    <p className="font-semibold text-gray-900">{health.system.node_version}</p>
                  </div>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Memory Usage
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Free Memory</span>
                      <span className="font-semibold text-gray-900">
                        {(health.system.memory.free / 1024 / 1024 / 1024).toFixed(2)} GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(health.system.memory.free / health.system.memory.total * 100).toFixed(0)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Total Memory</span>
                    <span className="font-semibold text-gray-900">
                      {(health.system.memory.total / 1024 / 1024 / 1024).toFixed(2)} GB
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last checked: {new Date(health.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <button
                onClick={() => setShowHealthModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;