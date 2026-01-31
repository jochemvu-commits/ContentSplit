"use client";

import { useState } from "react";

type OutputType = "twitter" | "linkedin" | "summary" | "takeaways";

interface RepurposeResult {
  twitter: string[];
  linkedin: string;
  summary: string;
  takeaways: string[];
}

export default function Home() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [activeTab, setActiveTab] = useState<OutputType>("twitter");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (content.length < 100) {
      setError("Please enter at least 100 characters");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to repurpose content");
      }

      const data = await response.json();
      setResult(data);
      setActiveTab("twitter");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOutputText = () => {
    if (!result) return "";
    switch (activeTab) {
      case "twitter":
        return result.twitter.join("\n\n");
      case "linkedin":
        return result.linkedin;
      case "summary":
        return result.summary;
      case "takeaways":
        return result.takeaways.map((t, i) => `• ${t}`).join("\n");
    }
  };

  const getCharCount = () => {
    const text = getOutputText();
    return text.length;
  };

  const tabs: { id: OutputType; label: string; icon: string }[] = [
    { id: "twitter", label: "Twitter Thread", icon: "𝕏" },
    { id: "linkedin", label: "LinkedIn", icon: "in" },
    { id: "summary", label: "Summary", icon: "📝" },
    { id: "takeaways", label: "Takeaways", icon: "💡" },
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Content<span className="text-orange-500">Split</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Turn One Post Into a Week of Content
          </p>
          <p className="text-gray-500">
            Stop spending hours reformatting. Paste your content, get platform-ready outputs in 30 seconds.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your blog post, article, or transcript here..."
            className="w-full h-48 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              {content.length} characters {content.length < 100 && content.length > 0 && "(min 100)"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || content.length < 100}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Repurposing...
                </>
              ) : (
                <>🚀 Repurpose It</>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Output Section */}
        {result && (
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Output Content */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 min-h-[200px]">
              {activeTab === "twitter" ? (
                <div className="space-y-4">
                  {result.twitter.map((tweet, index) => (
                    <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-white whitespace-pre-wrap">{tweet}</p>
                        <button
                          onClick={() => copyToClipboard(tweet)}
                          className="text-gray-500 hover:text-white shrink-0"
                          title="Copy tweet"
                        >
                          📋
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{tweet.length}/280</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white whitespace-pre-wrap">{getOutputText()}</div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                {getCharCount()} characters
              </span>
              <button
                onClick={() => copyToClipboard(getOutputText())}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2"
              >
                {copied ? "✓ Copied!" : "📋 Copy All"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          Built by <a href="#" className="text-orange-500 hover:underline">gymguard</a> • Powered by Claude AI
        </div>
      </div>
    </main>
  );
}
