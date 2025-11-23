import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE}/api/links/${code}`);
      if (!res.ok) {
        setLink(null);
      } else {
        setLink(await res.json());
      }
      setLoading(false);
    }
    load();
  }, [code]);

  if (loading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-stone-600">Loading stats...</p>
        </div>
      </div>
    );

  if (!link)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center text-stone-600">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">Link not found</p>
          <a href="/" className="text-emerald-700 hover:text-emerald-800 underline font-medium">
            Go back to dashboard
          </a>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            Stats for {code}
          </h1>
          <p className="text-stone-600">Detailed analytics for your short link</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-stone-100">
          <div className="text-center pb-6 border-b border-stone-100">
            <h2 className="text-sm font-medium text-stone-500 mb-2">Total Clicks</h2>
            <p className="text-5xl font-bold text-emerald-800">{link.total_clicks.toLocaleString()}</p>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-stone-600 mb-2">Original URL</h2>
              <p className="text-base text-emerald-700 break-words font-medium">{link.target_url}</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-stone-600 mb-2">Short URL</h2>
              <a
                href={`${API_BASE}/${code}`}
                className="text-emerald-700 hover:text-emerald-800 underline font-medium inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {API_BASE}/{code}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-stone-600 mb-2">Last Clicked</h2>
              <p className="text-stone-800 font-medium">
                {link.last_clicked_at
                  ? new Date(link.last_clicked_at).toLocaleString()
                  : "Never"}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-stone-600 mb-2">Created At</h2>
              <p className="text-stone-800 font-medium">
                {new Date(link.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <a
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-xl hover:bg-emerald-800 hover:shadow-lg transition-all font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}