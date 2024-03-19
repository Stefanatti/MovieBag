import { useState, useEffect } from "react";
import axios from "axios";

const useFetchData = (url, userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userId) {
          const response = await axios.get(`${url}${userId}`);
          setData(response.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, userId]); // Re-fetch if the userId changes

  return { data, loading, error };
};

export default useFetchData;
