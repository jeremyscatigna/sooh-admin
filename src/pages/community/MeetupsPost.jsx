import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

import MeetupImage from '../../images/meetup-image.jpg';
import MeetupThumb from '../../images/meetups-thumb-02.jpg';
import Avatar02 from '../../images/avatar-02.jpg';
import Avatar03 from '../../images/avatar-03.jpg';
import Avatar04 from '../../images/avatar-04.jpg';
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../main';
import Avvvatars from 'avvvatars-react';
import { useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Check, MapsArrowDiagonal, Safari } from 'iconoir-react';
import DashboardCard01 from '../../partials/dashboard/DashboardCard01';
import ImageGallery from 'react-image-gallery';
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/css/image-gallery.css';

const doIFavoriteThis = (item, user) => {
    if (item.favorites) {
        return item.favorites.filter((favorite) => favorite.userId === user.uid).length > 0;
    }
    return false;
};

function MeetupsPost() {
    const { id } = useParams();
    const connectedUser = useAtomValue(currentUser);
    // const connectedUser = JSON.parse(localStorage.getItem('user'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [happyHour, setHappyHour] = useState([]);
    const [user, setUser] = useState({});
    const [attendees, setAttendees] = useState([]);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [favorite, setFavorite] = React.useState(false);

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        const collectionQuery = query(collection(db, 'happyhours'), where('uid', '==', id));

        const unsub = onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setHappyHour(data[0] || null);
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

    useEffect(() => {
        setFavorite(happyHour.favorites ? doIFavoriteThis(happyHour, connectedUser) : false);
    }, [happyHour, connectedUser]);

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

    const handleAddToFavorite = async () => {
        // Prevent default form submission behavior
        const favoriteObject = {
            id: uuidv4(),
            userId: connectedUser.uid,
        };

        let updatedFavorites = [];
        if (favorite) {
            updatedFavorites = happyHour.favorites.filter((fav) => fav.userId !== connectedUser.uid);
            setFavorite(false);
        } else {
            updatedFavorites = happyHour.favorites ? [...happyHour.favorites, favoriteObject] : [favoriteObject];
            setFavorite(true);
        }

        const convcollref = doc(db, 'happyhours', happyHour.id);
        try {
            await updateDoc(convcollref, {
                favorites: updatedFavorites,
            });
        } catch (error) {
            console.error('Error updating favorites: ', error);
        }
    };

    const removeFirstPartOfUrl = (url) => {
        if (url) {
            return url.toLowerCase().replace('https://', '');
        }

        return url;
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

    const isUserAttending = attendees.some((attendee) => attendee.uid === connectedUser.uid);

    const images = happyHour.optionImgUrls ? happyHour.optionImgUrls.map((url) => {
        return {
            original: url,
            thumbnail: url,
        };
    }) : [];

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <div className={`px-4 sm:px-6 lg:px-8 py-8 w-full ${mobile && 'mb-24'}`}>
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
                                    {happyHour && displayDateOrRecurency(happyHour)}
                                </div>
                                <header className='mb-4'>
                                    {/* Title */}
                                    <div className='flex flex-wrap items-center mb-2'>
                                        <h1 className='text-2xl md:text-3xl text-primary font-bold'>{happyHour.name}</h1>
                                        {happyHour.deal && (
                                            <span className='text-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded-full px-3 py-1 ml-2'>
                                                -{happyHour.deal}
                                            </span>
                                        )}
                                    </div>
                                    <p>{happyHour.description}</p>

                                    <p className='text-secondary text-xs flex row mt-1'>
                                        {happyHour.type === 'instore' || happyHour.type === 'home' ? (
                                            <>
                                                <MapsArrowDiagonal className='h-4 w-4 mr-1' />
                                                <a
                                                    href={`http://maps.google.com/?q=${happyHour.location}`}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    {happyHour.location}
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <Safari className='h-4 w-4 mr-1' />
                                                <a href={happyHour.location} target='_blank' rel='noopener noreferrer'>
                                                    {removeFirstPartOfUrl(happyHour.location)}
                                                </a>
                                            </>
                                        )}
                                    </p>
                                    <p className='text-secondary text-xs flex row mt-1'>
                                        {happyHour.closedDays && (
                                            <>
                                                <span className='mr-1'>Fermé le(s) </span>
                                                {happyHour.closedDays.map((day) => (
                                                    <span key={day} className='mr-1'>
                                                        {day}
                                                    </span>
                                                ))}
                                            </>
                                        )}
                                    </p>
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
                                                {user.username && user.username !== ''
                                                    ? user.username
                                                    : user.firstName + ' ' + user.lastName}
                                            </a>
                                        </div>
                                    </div>
                                    {/* Right side */}
                                </div>

                                {user.type === 'business' && happyHour.userId === connectedUser.uid && (
                                    <div className='mb-6 grid grid-cols-8 gap-4'>
                                        <div className='flex flex-col justify-center items-center col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl'>
                                            <div className='px-5 pt-5'>
                                                <header className='flex justify-between items-center space-x-2'>
                                                    <h2 className='text-lg font-semibold text-primary'>Nombre de click</h2>
                                                </header>
                                                <div className='flex flex-col items-center justify center'>
                                                    <div className='text-8xl font-bold text-primary mr-2'>0</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col justify-center items-center col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl'>
                                            <div className='px-5 pt-5'>
                                                <header className='flex justify-between items-center space-x-2'>
                                                    <h2 className='text-lg font-semibold text-primary'>Nombre de participants</h2>
                                                </header>
                                                <div className='flex flex-col items-center justify center'>
                                                    <div className='text-8xl font-bold text-primary mr-2'>
                                                        {attendees ? attendees.length : 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col justify-center items-center col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl'>
                                            <div className='px-5 pt-5'>
                                                <header className='flex justify-between items-center space-x-2'>
                                                    <h2 className='text-lg font-semibold text-primary'>Nombre de like</h2>
                                                </header>
                                                <div className='flex flex-col items-center justify center'>
                                                    <div className='text-8xl font-bold text-primary mr-2'>
                                                        {happyHour.likes ? happyHour.likes.length : 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col justify-center items-center col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl'>
                                            <div className='px-5 pt-5'>
                                                <header className='flex justify-between items-center space-x-2'>
                                                    <h2 className='text-lg font-semibold text-primary'>Nombre de favoris</h2>
                                                </header>
                                                <div className='flex flex-col items-center justify center'>
                                                    <div className='text-8xl font-bold text-primary mr-2'>
                                                        {happyHour.favorites ? happyHour.favorites.length : 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {happyHour.options &&
                                happyHour.options.some(
                                    (option) =>
                                        option.name === 'Pack photo +3' || option.name === 'Pack photo +10' || option.name === 'Pack VIP',
                                ) ? (
                                    <>
                                        <figure className='mb-6'>
                                            <img
                                                className='w-full rounded-sm'
                                                src={happyHour.imageUrl || MeetupImage}
                                                width='640'
                                                height='360'
                                                alt='Meetup'
                                            />
                                        </figure>
                                        <ImageGallery items={images} />
                                    </>
                                ) : (
                                    <figure className='mb-6'>
                                        <img
                                            className='w-full rounded-sm'
                                            src={happyHour.imageUrl || MeetupImage}
                                            width='640'
                                            height='360'
                                            alt='Meetup'
                                        />
                                    </figure>
                                )}

                                {/* Post content */}
                                <div className='mt-6'>
                                    <h2 className='text-xl leading-snug text-primary font-bold mb-2'>Détails</h2>
                                    <p className='mb-6 whitespace-pre-line'>{happyHour.details}</p>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className='space-y-4'>
                                {/* 1st block */}
                                <div className='space-y-2'>
                                    <button
                                        onClick={handleAddToFavorite}
                                        className='btn w-full bg-card hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded-full'
                                    >
                                        {favorite ? (
                                            <Check />
                                        ) : (
                                            <svg className='w-4 h-4 fill-current shrink-0' viewBox='0 0 16 16'>
                                                <path d='m2.457 8.516.969-.99 2.516 2.481 5.324-5.304.985.989-6.309 6.284z' />
                                            </svg>
                                        )}
                                        <span className='ml-1'>{favorite ? 'Favoris' : 'Ajouter au favoris'}</span>
                                    </button>
                                </div>

                                <div className='space-y-2'>
                                    {!isUserAttending && (
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
                                                <li key={attendee.uid}>
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
                                                                    {attendee.username
                                                                        ? attendee.username
                                                                        : attendee.firstName + ' ' + attendee.lastName}
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
