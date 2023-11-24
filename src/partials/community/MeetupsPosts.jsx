import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';

import MeetupsThumb01 from '../../images/meetups-thumb-01.jpg';
import useTimer from '../../components/Timer';
import { getCategoriesShadowColor } from '../../utils/categories';
import { MapsArrowDiagonal } from 'iconoir-react';
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { db } from '../../main';
import { useAtomValue } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '../../pages/Signup';
import Avvvatars from 'avvvatars-react';

dayjs.extend(LocalizedFormat);
dayjs.extend(RelativeTime);

function MeetupsPosts({ data, filtering }) {
    const user = useAtomValue(currentUser);

    // Filter function
    const filterMeetups = (item) => {
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

    // Memoized data for optimization
    const filteredData = useMemo(() => data.filter(filterMeetups), [data, filtering]);

    // Component rendering
    return (
        <div className='grid xl:grid-cols-2 gap-6'>
            {filteredData.map((item) => (
                <MeetupItem item={item} key={item.uid} />
            ))}
        </div>
    );
}

const doILikeThisHH = (item, user) => {
    if (item.likes) {
        return item.likes.filter((like) => like.userId === user.uid).length > 0;
    }
    return false;
};

function MeetupItem({ item }) {
    const user = useAtomValue(currentUser);
    const { days, hours, minutes, seconds } = useTimer(item.date);
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
            </Link>
            {/* Content */}
            <div className='grow p-5 flex flex-col'>
                <div className='grow mb-2'>
                    <div className='text-xs font-semibold text-pink-500 uppercase mb-2'>{dayjs(item.date).format('LLL')}</div>
                    <Link className='inline-flex' to={`/happyhours/${item.uid}`}>
                        <h3 className='text-sm font-bold text-primary'>{item.name}</h3>
                    </Link>
                    <p className='text-secondary text-xs'>
                        Commence: {days}j {hours}h {minutes}m {seconds}s
                    </p>
                    <p className='text-secondary text-xs flex flex row mt-1'>
                        <MapsArrowDiagonal className='h-4 w-4 mr-1' />
                        {city}
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
                </div>
            </div>
        </article>
    );
}

export default MeetupsPosts;
