import { useState } from "react";

const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const request = async (method, url, payload = null, options = {}) => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        body: payload ? JSON.stringify(payload) : null,
        ...options,
      });

      const resData = await res.json();

      if (!res.ok) throw new Error(resData.message || "Request failed");

      setResponse(resData);
      return resData;
    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong!!");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const post = (url, payload, options) => request("POST", url, payload, options);
  const patch = (url, payload, options) => request("PATCH", url, payload, options);
  const del = (url, options) => request("DELETE", url, null, options);

  return { post, patch, del, loading, error, response };
};

export default useHttp;
