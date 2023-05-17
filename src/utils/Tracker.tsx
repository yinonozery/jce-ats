import { useEffect } from 'react';

const Tracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('https://k00isbe8n9.execute-api.us-east-1.amazonaws.com/jce/tracking', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Visit tracked successfully');
        } else {
          console.error('Failed to track visit');
        }
      } catch (error) {
        console.error('An error occurred while tracking the visit:', error);
      }
    };

    trackVisit();
  }, []);
  return <></>
};

export default Tracker;
