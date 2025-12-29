import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("api call");
    const apiCall = async () => {
      try {
        const response = await axios.get(url);
        // console.log("Fetched products:", response.data);
        // console.log("Fetched products:", response.data.data);
        setProducts(response.data.data);
      } catch (error) {
        console.log(error);
        setIsError(error.message);
      } finally {
        setLoading(false);
      }
    };
    apiCall();
  }, [url]);

  return { products, loading, isError };
};

export default useFetch;
