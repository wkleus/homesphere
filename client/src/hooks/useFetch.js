import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // skip fetch if url is not yet available
    if (!url) return;

    // solve race conditions by abort the previous request:
    // cancel the fetch when the component unmounts
    // or the url changes before the previous request completes
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        // ignore abort errors
        if (err.name === "AbortError") return;
        setState({ data: null, loading: false, error: err.message });
      });

    // cleanup: abort the fetch when the component unmounts or url changes
    return () => controller.abort();
  }, [url]);

  return state;
};

export default useFetch;
