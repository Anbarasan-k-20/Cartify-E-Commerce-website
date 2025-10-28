import { useEffect, useState } from "react";
import axios from "axios";
const useFetch = (url) => {
  const [products, setProducts] = useState([]);
  const [loading, isLoading] = useState(true);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    const apiCall = async () => {
      try {
        let response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
        setIsError(error.message);
      } finally {
        isLoading(false);
      }
    };
    apiCall();
  }, [url]);
  return { products, loading, isError };
};
export default useFetch;
