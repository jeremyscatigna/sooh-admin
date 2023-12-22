import dayjs from 'dayjs';
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

const getLocaleDateTime = () => {
    let d = new Date();
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    return dateTimeLocalValue;
};

const getHoursFromDateTime = (date) => {
    return dayjs(date).format('HH:mm');
};

export default function useTimer(deadline, interval = SECOND, endTime) {
    const [timespan, setTimespan] = useState(new Date(deadline) - Date.now());
    const [text, setText] = useState('Debut:');
    const [endTimeState, setEndTimeState] = useState(endTime);
    const [deadlineState, setDeadlineState] = useState(deadline);

    useEffect(() => {
        if (endTime) {
            setEndTimeState(endTime);
        }

        const deadlineHours = getHoursFromDateTime(deadlineState);

        if (deadlineHours < endTime && dayjs(deadlineState).isBefore(dayjs(getLocaleDateTime()))) {
            setDeadlineState(replaceDeadlineTimeWithEndTime(deadlineState, endTimeState));
            setText('Fin:')
        }
    }, [endTimeState, deadlineState, endTime, deadline]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimespan(new Date(deadlineState) - Date.now());
        }, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [deadlineState, interval]);

    return {
        days: Math.floor(timespan / DAY),
        hours: Math.floor((timespan / HOUR) % 24),
        minutes: Math.floor((timespan / MINUTE) % 60),
        seconds: Math.floor((timespan / SECOND) % 60),
        text
    };
}
