import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';

import MeetupsThumb01 from '../../images/meetups-thumb-01.jpg';
import UserImage01 from '../../images/avatar-01.jpg';
import UserImage04 from '../../images/avatar-04.jpg';
import UserImage05 from '../../images/avatar-05.jpg';
import useTimer from '../../components/Timer';
import { getCategoriesShadowColor } from '../../utils/categories';
import { MapsArrowDiagonal } from 'iconoir-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../main';

function MeetupsPosts({ data }) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

    return (
        <div className='grid xl:grid-cols-2 gap-6'>
            {data.map((item, i) => {
                const { days, hours, minutes, seconds } = useTimer(item.date);
                const [like, setLike] = useState(false);
                const [city, setCity] = useState('');

                useEffect(() => {
                    const fetchData = async () => {
                        const userCompany = await getDocs(query(collection(db, `users/${item.userId}/company`)));
                        const c = userCompany.docs.map((doc) => doc.data());
                        setCity(c[0].city);
                    };
                    fetchData();
                }, []);
                return (
                    <article
                        className={`flex bg-card ${window.innerWidth <= 500 && 'h-38'} shadow-lg ${
                            item.category && getCategoriesShadowColor(item.category)
                        } rounded-lg overflow-hidden`}
                        key={i}
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
                                        <img
                                            className='rounded-full border-2 border-white box-content'
                                            src={UserImage01}
                                            width='28'
                                            height='28'
                                            alt='User 01'
                                        />
                                        <img
                                            className='rounded-full border-2 border-white box-content'
                                            src={UserImage04}
                                            width='28'
                                            height='28'
                                            alt='User 04'
                                        />
                                        <img
                                            className='rounded-full border-2 border-white box-content'
                                            src={UserImage05}
                                            width='28'
                                            height='28'
                                            alt='User 05'
                                        />
                                    </div>
                                    <div className='text-xs font-medium text-secondary italic'>+22</div>
                                </div>
                                {/* Like button */}
                                <button onClick={() => setLike(!like)}>
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
            })}
        </div>
    );
}

export default MeetupsPosts;
