import { useState, useEffect } from "react";
import api from "../api/axios";

const useFetchData = (url, userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requestUrl = userId ? `${url}${userId}` : url;
        const response = await api.get(requestUrl);
        setData(response.data);
      } catch (error) {
        if (!error.response) {
          setError("Network error: " + error.message);
        } else {
          setError("Server error: " + error.response.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, userId]);

  return { data, loading, error };
};

export default useFetchData;
