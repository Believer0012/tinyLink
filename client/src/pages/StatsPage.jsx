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
      <div className="p-10 text-center">
        <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading stats...</p>
      </div>
    );

  if (!link)
    return (
      <div className="p-10 text-center text-gray-600">
        Link not found.<br />
        <a href="/" className="text-blue-600 underline">Go back</a>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Stats for {code}
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border border-gray-100">
          <div>
            <h2 className="text-sm text-gray-500">Original URL</h2>
            <p className="text-lg text-blue-600 break-words">{link.target_url}</p>
          </div>

          <div>
            <h2 className="text-sm text-gray-500">Short URL</h2>
            <a
              href={`${API_BASE}/${code}`}
              className="text-blue-700 underline"
              target="_blank"
            >
              {API_BASE}/{code}
            </a>
          </div>

          <div>
            <h2 className="text-sm text-gray-500">Total Clicks</h2>
            <p className="text-3xl font-bold">{link.total_clicks}</p>
          </div>

          <div>
            <h2 className="text-sm text-gray-500">Last Clicked</h2>
            <p className="text-gray-700">
              {link.last_clicked_at
                ? new Date(link.last_clicked_at).toLocaleString()
                : "Never"}
            </p>
          </div>

          <div>
            <h2 className="text-sm text-gray-500">Created At</h2>
            <p className="text-gray-700">
              {new Date(link.created_at).toLocaleString()}
            </p>
          </div>

          <a
            href="/"
            className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition"
          >
            Go Back
          </a>
        </div>
      </div>
    </div>
  );
}
