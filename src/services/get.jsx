import { useState, useEffect } from "react";
import {useUserId} from "../contexts/userIdContext";
const UseFetch = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMg, setErrorMg] = useState("");
  const {getId} = useUserId();
  async function fetchData() {
      setLoading(true);
    try {
      const res = await fetch(url , {...options});
      if (res.ok) {
        const data =await res.json();
        setData(data);
        setErrorMg("");
      } return;
    } catch (e) {
      console.log(e);
      setErrorMg("something went wrong!!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [url,getId]);

  return { data, loading, errorMg };
};

export default UseFetch;
