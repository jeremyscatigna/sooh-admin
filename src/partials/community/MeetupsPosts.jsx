import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';

import MeetupsThumb01 from '../../images/meetups-thumb-01.jpg';
import useTimer from '../../components/Timer';
import { getCategoriesShadowColor } from '../../utils/categories';
import { Edit, MapsArrowDiagonal, Safari, Trash } from 'iconoir-react';
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { db } from '../../main';
import { useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '../../pages/Signup';
import Avvvatars from 'avvvatars-react';
import DropdownEditMenu from '../../components/DropdownEditMenu';

dayjs.extend(LocalizedFormat);
dayjs.extend(RelativeTime);

function MeetupsPosts({ data, now, toCome, filtering, searchText, selectedCategory, isMyHappyHours, myHappyHours }) {
    const user = useAtomValue(currentUser);

    const [mobile, setMobile] = useState(window.innerWidth <= 500);

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    // Filter function
    const filterMeetups = (item) => {
        if (selectedCategory && item.category !== selectedCategory) return false;

        switch (filtering) {
            case 'online':
                return item.type === 'online';
            case 'instore':
                return item.type === 'instore';
            case 'thisweek':
                return item.date && dayjs(item.date).isBefore(dayjs().add(7, 'day'));
            case 'thismonth':
                return item.date && dayjs(item.date).isBefore(dayjs().add(1, 'month'));
            case 'favorites':
                return item.favorites && item.favorites.some((favorite) => favorite.userId === user.uid);
            default:
                return true;
        }
    };

    // Additional search filter
    const searchFilter = (item) => {
        if (!searchText) return true; // If no search text, return all items
        const lowerCaseSearchText = searchText.toLowerCase();
        return item.name.toLowerCase().includes(lowerCaseSearchText);
        // Add more fields to check as needed
    };

    const applyFilters = (data) => {
        return data.filter((item) => filterMeetups(item) && searchFilter(item));
    };

    // Memoized filtered data for 'now' and 'toCome'
    const filteredNow = useMemo(() => applyFilters(now), [now, filtering, searchText, selectedCategory]);
    const filteredToCome = useMemo(() => applyFilters(toCome), [toCome, filtering, searchText, selectedCategory]);

    // Component rendering
    return (
        <div className={`flex flex-col items-start mb-6 ${mobile && 'mb-24'} space-y-6 w-full`}>
            {isMyHappyHours === true ? (
                <div className='w-full'>
                    <div className={`grid xl:grid-cols-2 gap-6`}>
                        {myHappyHours.map((item, i) => (
                            <MeetupItem item={item} key={`${item.uid}+${i}`} isMyHappyHour={true} />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {filteredNow.length > 0 && (
                        <div className='w-full'>
                            <h2 className='text-2xl font-bold text-primary pb-6'>En ce moment</h2>
                            <div className={`grid xl:grid-cols-2 gap-6`}>
                                {filteredNow.map((item, i) => (
                                    <MeetupItem item={item} key={`${item.uid}+${i}`} isMyHappyHour={false} />
                                ))}
                            </div>
                        </div>
                    )}
                    {filteredToCome.length > 0 && (
                        <div className='w-full pt-6'>
                            <h2 className='text-2xl font-bold text-primary pb-6'>Prochainement</h2>
                            <div className={`grid xl:grid-cols-2 gap-6 ${mobile && 'mb-24'}`}>
                                {filteredToCome.map((item, i) => (
                                    <MeetupItem item={item} key={`${item.uid}+${i}`} isMyHappyHour={false} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const doILikeThisHH = (item, user) => {
    if (item.likes) {
        return item.likes.filter((like) => like.userId === user.uid).length > 0;
    }
    return false;
};

const removeFirstPartOfUrl = (url) => {
    return url.replace('https://', '');
};

const getTodayDateWithEndTime = (endTime) => {
    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10);
    const todayWithEndTime = todayDate + 'T' + endTime;
    return todayWithEndTime;
}

const getTodayDateByEndOfDay = () => {
    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10);
    const todayWithEndTime = todayDate + 'T23:59:59';
    return todayWithEndTime;
}

function MeetupItem({ item, isMyHappyHour }) {
    const user = useAtomValue(currentUser);
    if (item.date && dayjs(item.date).isBefore(dayjs()) && getTodayDateWithEndTime(item.endTime) < dayjs().toISOString()) {
        // return date + 1 day
        item.date = dayjs(item.date).add(1, 'day');
    }

    if (item.date && dayjs(item.date).isBefore(dayjs()) && !item.endTime) {
        // return today at end of day
        item.date = getTodayDateByEndOfDay();
    }

    const { days, hours, minutes, seconds, text } = useTimer(item.date, 1000, item.endTime);
    const [like, setLike] = useState(item.likes ? doILikeThisHH(item, user) : false);
    const [city, setCity] = useState('');
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getDocs(collection(db, `happyhours/${item.uid}/participants`));
            setAttendees(res.docs.map((doc) => doc.data()) || []);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        let isMounted = true; // To avoid setting state on unmounted component
        const fetchData = async () => {
            const userCompany = await getDocs(query(collection(db, `users/${item.userId}/company`)));
            const c = userCompany.docs.map((doc) => doc.data());
            if (isMounted) {
                setCity(c[0].city);
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, [item.userId]);

    useEffect(() => {
        setLike(item.likes ? doILikeThisHH(item, user) : false);
    }, [item]);

    const handleLikeUpdate = async (e) => {
        e.preventDefault();
        const likeObject = {
            id: uuidv4(),
            userId: user.uid,
        };

        let updatedLikes = [];
        if (like) {
            updatedLikes = item.likes.filter((like) => like.userId !== user.uid);
            item.likes = updatedLikes;
            setLike(false);
        } else {
            updatedLikes = [...item.likes, likeObject];
        }
        item.likes = updatedLikes;
        const convcollref = doc(db, 'happyhours', item.id);

        // Update the Firestore document with the new comments array
        updateDoc(convcollref, {
            likes: updatedLikes,
        });
    };

    const getHoursFromDateTime = (date) => {
        return dayjs(date).format('HH:mm');
    };

    const getDayFromDateTime = (date) => {
        return dayjs(date).format('dddd');
    };

    const displayDateOrRecurency = (happyHour) => {
        if (happyHour.recurency === 'Daily') {
            if (happyHour.endTime) {
                return 'Tous les jours de ' + getHoursFromDateTime(happyHour.date) + ' a ' + happyHour.endTime;
            }
            return 'Tous les jours a ' + getHoursFromDateTime(happyHour.date);
        }

        if (happyHour.recurency === 'Weekly') {
            if (happyHour.endTime) {
                return (
                    'Tous les ' +
                    getDayFromDateTime(happyHour.date) +
                    ' de ' +
                    getHoursFromDateTime(happyHour.date) +
                    ' a ' +
                    happyHour.endTime
                );
            }
            return 'Tous les ' + getDayFromDateTime(happyHour.date) + ' a ' + getHoursFromDateTime(happyHour.date);
        }

        return dayjs(happyHour.date).format('LLL');
    };

    return (
        <article
            className={`flex bg-card ${window.innerWidth <= 500 && 'h-38'} shadow-lg ${
                item.category && getCategoriesShadowColor(item.category)
            } rounded-lg overflow-hidden`}
            key={item.uid}
        >
            {/* Image */}
            <Link
                className='relative block w-32 sm:w-56 xl:sidebar-expanded:w-40 2xl:sidebar-expanded:w-56 shrink-0'
                to={`/happyhours/${item.uid}`}
            >
                <img
                    className='absolute object-cover object-center w-full h-full'
                    src={item.imageUrl || MeetupsThumb01}
                    width='220'
                    height='236'
                    alt='Meetup 01'
                />
                {item.deal && (
                    <div className='absolute bottom-2 left-2 px-3 py-1 text-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded-full '>
                        -{item.deal}
                    </div>
                )}
            </Link>
            {/* Content */}
            <div className='grow p-5 flex flex-col'>
                <div className='grow mb-2'>
                    <div className='text-xs font-semibold text-pink-500 uppercase mb-2'>{displayDateOrRecurency(item)}</div>
                    <Link className='inline-flex' to={`/happyhours/${item.uid}`}>
                        <h3 className='text-sm font-bold text-primary'>{item.name}</h3>
                    </Link>
                    <p className='text-secondary text-xs flex row mt-1'>{item.description}</p>

                    <p className='text-secondary text-xs mt-1'>
                        {text} {days}j {hours}h {minutes}m {seconds}s
                    </p>
                </div>
                {/* Footer */}
                <div className='flex justify-between items-center mt-3'>
                    {/* Avatars */}
                    <div className='flex items-center space-x-2'>
                        <div className='flex -space-x-3 -ml-0.5'>
                            {attendees
                                .slice(0, 3)
                                .map((attendee) =>
                                    attendee.avatar ? (
                                        <img
                                            key={attendee.uid}
                                            className='rounded-full border-2 border-white box-content'
                                            src={attendee.avatar}
                                            width='28'
                                            height='28'
                                            alt='User 01'
                                        />
                                    ) : (
                                        <Avvvatars key={attendee.uid} value={`${attendee.firstName} ${attendee.lastName}`} />
                                    ),
                                )}
                        </div>
                        {attendees.length > 3 && <div className='text-xs font-medium text-secondary italic'>+{attendees.length - 3}</div>}
                    </div>
                    {/* Like button */}

                    {isMyHappyHour === true ? (
                        <div className='flex space-x-2'>
                            <Link to={`/happyhours/${item.uid}`}>
                                <div className='flex items-center space-x-2 hover:text-green-400'>
                                    <Edit className='w-5 h-5' />
                                </div>
                            </Link>

                            <Link to={`/happyhours/${item.uid}`}>
                                <div className='flex items-center space-x-2 hover:text-red-500'>
                                    <Trash className='w-5 h-5' />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                setLike(!like);
                                handleLikeUpdate(e);
                            }}
                        >
                            <div className='text-slate-100 bg-slate-900 bg-opacity-60 rounded-full'>
                                <span className='sr-only'>Like</span>
                                <svg className={`h-8 w-8`} fill={like ? 'red' : 'white'} viewBox='0 0 32 32'>
                                    <path d='M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z' />
                                </svg>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

export default MeetupsPosts;
