import { useEffect } from 'react';

const Tracker = () => {

  useEffect(() => {
    const trackVisit = async () => {
      fetch(`${process.env.REACT_APP_BASE_URL}/jce/tracking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    trackVisit();
  }, []);
  return <></>
};

export default Tracker;
