import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';

import MeetupsThumb01 from '../../images/meetups-thumb-01.jpg';
import UserImage01 from '../../images/avatar-01.jpg';
import UserImage04 from '../../images/avatar-04.jpg';
import UserImage05 from '../../images/avatar-05.jpg';

function MeetupsPosts({ data }) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);
    return (
        <div className='grid xl:grid-cols-2 gap-6'>
            {data.map((item, i) => (
                <article className='flex bg-card shadow-lg rounded-lg overflow-hidden' key={i}>
                    {/* Image */}
                    <Link
                        className='relative block w-24 sm:w-56 xl:sidebar-expanded:w-40 2xl:sidebar-expanded:w-56 shrink-0'
                        to={`/happyhours/${item.uid}`}
                    >
                        <img
                            className='absolute object-cover object-center w-full h-full'
                            src={item.imageUrl || MeetupsThumb01}
                            width='220'
                            height='236'
                            alt='Meetup 01'
                        />
                        {/* Like button */}
                        <button className='absolute top-0 right-0 mt-4 mr-4'>
                            <div className='text-slate-100 bg-slate-900 bg-opacity-60 rounded-full'>
                                <span className='sr-only'>Like</span>
                                <svg className='h-8 w-8 fill-current' viewBox='0 0 32 32'>
                                    <path d='M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z' />
                                </svg>
                            </div>
                        </button>
                    </Link>
                    {/* Content */}
                    <div className='grow p-5 flex flex-col'>
                        <div className='grow'>
                            <div className='text-sm font-semibold text-pink-500 uppercase mb-2'>{dayjs(item.date).format('LLL')}</div>
                            <Link className='inline-flex mb-2' to={`/happyhours/${item.uid}`}>
                                <h3 className='text-lg font-bold text-primary'>{item.name}</h3>
                            </Link>
                            <div className='text-sm'>{item.description}</div>
                        </div>
                        {/* Footer */}
                        <div className='flex justify-between mt-3'>
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
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default MeetupsPosts;
