import { useState, useEffect } from 'react'
import config from "../config/config"
import axios from 'axios';

const usePageInfo = () => {
  
  const [loading, setLoading] = useState(true)
  const [pageInfo, setPageInfo] = useState({name:"", url:""});

  useEffect(() => {
    const API_URL = `https://graph.facebook.com/${config.PAGE_ID}?fields=name,picture&access_token=${config.ACCESS_TOKEN}`;

    axios.get(API_URL).then((response) => {
        const res = {
            name: response.data.name,
            url: response.data.picture.data.url,
          };
        setPageInfo(res)
        setLoading(false)
        console.log(res)
    }).catch((e) => {
        console.log("error: ", e)
    })
  }, []);

  return {pageInfo, loading};
}

export default usePageInfo