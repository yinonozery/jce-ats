import { useEffect, useState } from "react";

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: undefined }));

    useEffect(() => {
        document.title = process.env.REACT_APP_WINDOW_TITLE || '';
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: undefined }));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 10, fontSize: '.9em', gap: 10 }}>
            <span>{currentTime}</span>
        </div>
    )
}
export default CurrentTime;