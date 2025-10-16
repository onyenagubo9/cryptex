"use client";
import React, { useEffect, useState } from "react";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();

        // ✅ Ensure data is an array
        if (Array.isArray(data)) {
          setNews(data);
        } else if (data.results && Array.isArray(data.results)) {
          setNews(data.results);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Error loading news:", err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading)
    return <p className="text-center text-gray-400 mt-8">Loading crypto news...</p>;

  if (error)
    return (
      <p className="text-center text-red-400 mt-8">
        ❌ {error}
      </p>
    );

  if (!news.length)
    return (
      <p className="text-center text-gray-400 mt-8">
        No crypto news available right now.
      </p>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">
        📰 Latest Crypto News
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-[#1e1e1e] text-white rounded-2xl p-5 shadow hover:shadow-lg transition duration-300"
          >
            <h2 className="text-lg font-semibold mb-2">
              {item.title || "Untitled"}
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              {item.source?.title || "Unknown Source"}
            </p>
            <a
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Read more →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;
