import { useState, useEffect } from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function replaceDeadlineTimeWithEndTime(deadline, endTime) {
    const deadlineDate = new Date(deadline);
    
    const endTimeHours = endTime.split(':')[0];
    const endTimeMinutes = endTime.split(':')[1];

    deadlineDate.setHours(endTimeHours);
    deadlineDate.setMinutes(endTimeMinutes);

    return deadlineDate;
}

export default function useTimer(deadline, interval = SECOND, endTime) {
    const [timespan, setTimespan] = useState(new Date(deadline) - Date.now());
    let text = 'Debut:'

    if (endTime && (new Date(deadline) - Date.now() <= 0)) {
        deadline = replaceDeadlineTimeWithEndTime(deadline, endTime);
        text = 'Fin:'
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimespan(new Date(deadline) - Date.now());
        }, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [deadline, interval]);

    return {
        days: Math.floor(timespan / DAY),
        hours: Math.floor((timespan / HOUR) % 24),
        minutes: Math.floor((timespan / MINUTE) % 60),
        seconds: Math.floor((timespan / SECOND) % 60),
        text
    };
}
