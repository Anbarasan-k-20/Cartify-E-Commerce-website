import { useEffect, useState } from "react";
import axios from "axios";
const useFetch = (url) => {
  let [products, setProducts] = useState([]);
  useEffect(() => {
    const apiCall = async () => {
      try {
        let response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    apiCall();
  }, [url]);
  return { products };
};
export default useFetch;
