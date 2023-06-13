import { useEffect } from 'react';

const Tracker = () => {
  useEffect(() => {
    if (Date.now() > Number(localStorage.getItem('trackInfo'))) {
      fetch(`${process.env.REACT_APP_BASE_URL}/tracking`, {
        method: 'GET',
      }).then((res) => res.json().then((resJson) => {
        if (resJson?.statusCode === 200)
          localStorage.setItem("trackInfo", String(Date.now() + 60 * 60000)); // 60 Minutes
      }));
    }
  }, []);
  return <></>
};

export default Tracker;
