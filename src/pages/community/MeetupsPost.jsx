import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

import MeetupImage from '../../images/meetup-image.jpg';
import MeetupThumb from '../../images/meetups-thumb-02.jpg';
import Avatar02 from '../../images/avatar-02.jpg';
import Avatar03 from '../../images/avatar-03.jpg';
import Avatar04 from '../../images/avatar-04.jpg';
import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../main';
import Avvvatars from 'avvvatars-react';
import { useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import useTimer from '../../components/Timer';
import { getCategoriesShadowColor } from '../../utils/categories';

function MeetupsPost() {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [happyHour, setHappyHour] = useState([]);
    const [user, setUser] = useState({});
    const [attendees, setAttendees] = useState([]);

    const connectedUser = useAtomValue(currentUser);

    useEffect(() => {
        const collectionQuery = query(collection(db, 'happyhours'), where('uid', '==', id));

        const unsub = onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setHappyHour(data[0]);
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getDocs(collection(db, `happyhours/${id}/participants`));
            setAttendees(res.docs.map((doc) => doc.data()) || []);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        let userQuery;

        if (happyHour.userId !== undefined) {
            userQuery = query(collection(db, 'users'), where('uid', '==', happyHour.userId));

            onSnapshot(userQuery, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUser(data[0]);
            });
        }
    }, [happyHour]);

    const handleAddAttendee = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, `happyhours/${id}/participants`), {
                ...connectedUser,
            });
        } catch (e) {
            console.log(e);
        }

        setAttendees([...attendees, connectedUser]);
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full'>
                        {/* Page content */}
                        <div className='max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16'>
                            {/* Content */}
                            <div>
                                <div className='mb-6'>
                                    <Link
                                        className='btn-sm rounded-full px-3 bg-hover hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary'
                                        to='/happyhours'
                                    >
                                        <svg className='fill-current text-primary mr-2' width='7' height='12' viewBox='0 0 7 12'>
                                            <path d='M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z' />
                                        </svg>
                                        <span>Retours</span>
                                    </Link>
                                </div>
                                <div className='text-sm font-semibold text-pink-500 uppercase mb-2'>
                                    Mon 27 Dec, 2021 - 9:00 PM -&gt; 10:00 PM
                                </div>
                                <header className='mb-4'>
                                    {/* Title */}
                                    <h1 className='text-2xl md:text-3xl text-primary font-bold mb-2'>{happyHour.name}</h1>
                                    <p>{happyHour.description}</p> 
                                </header>

                                {/* Meta */}
                                <div className='space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 mb-6'>
                                    {/* Author */}
                                    <div className='flex items-center sm:mr-4'>
                                        <a className='block mr-2 shrink-0' href='#0'>
                                            <Avvvatars value={`${user.firstName} ${user.lastName}`} />
                                        </a>
                                        <div className='text-sm whitespace-nowrap'>
                                            Hébergé par{' '}
                                            <a className='font-semibold text-pink-500' href='#0'>
                                                {user.firstName} {user.lastName}
                                            </a>
                                        </div>
                                    </div>
                                    {/* Right side */}
                                </div>

                                {/* Image */}
                                <figure className='mb-6'>
                                    <img
                                        className='w-full rounded-sm'
                                        src={happyHour.imageUrl || MeetupImage}
                                        width='640'
                                        height='360'
                                        alt='Meetup'
                                    />
                                </figure>

                                {/* Post content */}
                                <div>
                                    <h2 className='text-xl leading-snug text-primary font-bold mb-2'>Détails</h2>
                                    <p className='mb-6'>{happyHour.details}</p>
                                </div>
                                <hr className='my-6 border-t border-slate-200' />

                                {/* Similar Meetups */}
                                <div>
                                    <h2 className='text-xl leading-snug text-primary font-bold mb-2'>Similaires</h2>
                                    <div className='space-y-8 sm:space-y-5 my-6 lg:mb-0'>
                                        {/* Related item */}
                                        <article className='flex bg-card shadow-lg rounded-xl overflow-hidden'>
                                            {/* Image */}
                                            <a
                                                className='relative block w-24 sm:w-56 lg:sidebar-expanded:w-20 xl:sidebar-expanded:w-56 shrink-0'
                                                href='#0'
                                            >
                                                <img
                                                    className='absolute object-cover object-center w-full h-full'
                                                    src={MeetupThumb}
                                                    width='220'
                                                    height='236'
                                                    alt='Meetup 02'
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
                                            </a>
                                            {/* Content */}
                                            <div className='grow p-5 flex flex-col'>
                                                <div className='grow'>
                                                    <div className='text-sm font-semibold text-pink-500 uppercase mb-2'>
                                                        Mon 27 Dec, 2021
                                                    </div>
                                                    <a className='inline-flex mb-2' href='#0'>
                                                        <h3 className='text-lg font-bold text-primary'>
                                                            New York &amp; New Jersey Virtual Retreat 2021
                                                        </h3>
                                                    </a>
                                                    <div className='text-sm'>
                                                        Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
                                                        industries for previewing layouts.
                                                    </div>
                                                </div>
                                                {/* Footer */}
                                                <div className='flex justify-between mt-3'>
                                                    {/* Tag */}
                                                    <div className='text-xs inline-flex items-center font-medium bg-slate-100 text-slate-600 rounded-full text-center px-2.5 py-1'>
                                                        <svg className='w-4 h-3 fill-slate-400 mr-2' viewBox='0 0 16 12'>
                                                            <path d='m16 2-4 2.4V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.6l4 2.4V2ZM2 10V2h8v8H2Z' />
                                                        </svg>
                                                        <span>Événement en ligne</span>
                                                    </div>
                                                    {/* Avatars */}
                                                    <div className='flex items-center space-x-2'>
                                                        <div className='flex -space-x-3 -ml-0.5'>
                                                            <img
                                                                className='rounded-full border-2 border-white box-content'
                                                                src={Avatar02}
                                                                width='28'
                                                                height='28'
                                                                alt='User 02'
                                                            />
                                                            <img
                                                                className='rounded-full border-2 border-white box-content'
                                                                src={Avatar03}
                                                                width='28'
                                                                height='28'
                                                                alt='User 03'
                                                            />
                                                            <img
                                                                className='rounded-full border-2 border-white box-content'
                                                                src={Avatar04}
                                                                width='28'
                                                                height='28'
                                                                alt='User 04'
                                                            />
                                                        </div>
                                                        <div className='text-xs font-medium text-secondary italic'>+132</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-4'>
                                {/* 1st block */}

                                <div className='space-y-2'>
                                    {!attendees.includes(connectedUser) && (
                                        <button
                                            onClick={(e) => handleAddAttendee(e)}
                                            className='btn w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded-full'
                                        >
                                            <svg className='w-4 h-4 fill-current shrink-0' viewBox='0 0 16 16'>
                                                <path d='m2.457 8.516.969-.99 2.516 2.481 5.324-5.304.985.989-6.309 6.284z' />
                                            </svg>
                                            <span className='ml-1'>Participer</span>
                                        </button>
                                    )}
                                </div>

                                {/* 2nd block */}
                                <div className='bg-card p-5 shadow-lg rounded-xl lg:w-72 xl:w-80'>
                                    <div className='flex justify-between space-x-1 mb-5'>
                                        <div className='text-sm text-primary font-semibold'>Participants ({attendees.length || 0})</div>
                                    </div>
                                    <ul className='space-y-3'>
                                        {attendees &&
                                            attendees.length > 0 &&
                                            attendees.map((attendee) => (
                                                <li>
                                                    <div className='flex justify-between'>
                                                        <div className='grow flex items-center'>
                                                            <div className='relative mr-3'>
                                                                {attendee.avatar ? (
                                                                    <img
                                                                        className='w-8 h-8 rounded-full'
                                                                        src={attendee.avatar}
                                                                        width='32'
                                                                        height='32'
                                                                        alt='User 08'
                                                                    />
                                                                ) : (
                                                                    <Avvvatars value={`${attendee.firstName} ${attendee.lastName}`} />
                                                                )}
                                                            </div>
                                                            <div className='truncate'>
                                                                <span className='text-sm font-medium text-primary'>
                                                                    {attendee.firstName} {attendee.lastName}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button className='text-slate-400 hover:text-slate-500 rounded-full'>
                                                            <span className='sr-only'>Menu</span>
                                                            <svg className='w-8 h-8 fill-current' viewBox='0 0 32 32'>
                                                                <circle cx='16' cy='16' r='2' />
                                                                <circle cx='10' cy='16' r='2' />
                                                                <circle cx='22' cy='16' r='2' />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MeetupsPost;
