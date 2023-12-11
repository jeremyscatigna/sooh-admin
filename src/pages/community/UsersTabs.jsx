import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../main';
import { getCategoriesShadowColor } from '../../utils/categories';
import { Link } from 'react-router-dom';
import Avvvatars from 'avvvatars-react';
import { Facebook, Instagram, Search, TikTok, Twitter, YouTube } from 'iconoir-react';

function UsersTabs() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [data, setData] = useState([]);

    const [searchText, setSearchText] = useState('');

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
        const fetchData = async () => {
            const res = await getDocs(query(collection(db, 'users'), where('type', '==', 'influencer')));
            const users = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Fetch influencer data for each user
            const fetchInfluencerData = users.map(async (user) => {
                const res2 = await getDocs(query(collection(db, `users/${user.uid}/influencer`)));
                const influencer = res2.docs.map((doc) => doc.data());
                return {
                    ...user,
                    category: influencer[0]?.category,
                    city: influencer[0]?.city,
                    influBio: influencer[0]?.bio,
                    followers: influencer[0]?.followers,
                    instagram: influencer[0]?.instagram,
                    facebook: influencer[0]?.facebook,
                    twitter: influencer[0]?.twitter,
                    youtube: influencer[0]?.youtube,
                    tiktok: influencer[0]?.tiktok,
                    minPrice: influencer[0]?.minPrice,
                    maxPrice: influencer[0]?.maxPrice,
                };
            });

            // Wait for all influencer data to be fetched
            const usersWithInfluencerData = await Promise.all(fetchInfluencerData);

            // Update the state with the new data
            setData(usersWithInfluencerData);
        };
        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    const filteredData = data.filter((item) => {
        // Assuming 'firstName' and 'lastName' are the fields you want to search.
        // Modify as per your data structure.
        return item.firstName.toLowerCase().includes(searchText) || item.lastName.toLowerCase().includes(searchText);
    });

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden pb-24'>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                        {/* Page header */}
                        <div className='sm:flex sm:justify-between sm:items-center mb-8'>
                            {/* Right: Actions */}
                            <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
                                {/* Search form */}

                                <form className='relative'>
                                    <label htmlFor='feed-search-desktop' className='sr-only'>
                                        Search
                                    </label>
                                    <input
                                        id='feed-search-desktop'
                                        className='form-input bg-hover text-secondary border-none rounded-full w-full pl-9 focus:border-slate-300'
                                        type='search'
                                        placeholder='Rechercher…'
                                        value={searchText}
                                        onChange={handleSearchChange}
                                    />
                                    <button className='absolute inset-0 right-auto group' type='submit' aria-label='Search'>
                                        <Search className='w-4 h-4 shrink-0 text-secondary group-hover:text-slate-500 ml-3 mr-2' />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className='grid grid-cols-12 gap-6'>
                            {filteredData.map((item) => {
                                console.log(item);
                                return (
                                    <div
                                        key={item.id}
                                        className={`col-span-full sm:col-span-6 xl:col-span-3 bg-card shadow-lg ${
                                            item.category !== undefined
                                                ? getCategoriesShadowColor(item.category)
                                                : getCategoriesShadowColor('Autre')
                                        } rounded-xl`}
                                    >
                                        <div className='flex flex-col h-full'>
                                            {/* Card top */}
                                            <div className='grow p-5'>
                                                {/* Menu button */}
                                                {/* Image + name */}

                                                <header className='relative'>
                                                    
                                                    <button
                                                        className='absolute right-0 top-0 hover:text-pink-500 z-60'
                                                        onClick={(e) => {
                                                            false
                                                        }}
                                                    >
                                                        <div className=' text-slate-100 bg-slate-900 bg-opacity-60 rounded-full'>
                                                            <span className='sr-only'>Like</span>
                                                            <svg className={`h-8 w-8`} fill={'white'} viewBox='0 0 32 32'>
                                                                <path d='M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z' />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                    <Link className='absolute left-2 top-2 hover:text-pink-500 z-60' to='/messages'>
                                                        <svg className='w-4 h-4 fill-current shrink-0' viewBox='0 0 16 16'>
                                                            <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                                                        </svg>
                                                    </Link>
                                                    <div className='flex justify-center mb-2'>
                                                        <Link className='relative inline-flex items-start' to={`/profile/${item.uid}`}>
                                                            {item.avatar !== '' ? (
                                                                <img
                                                                    className='rounded-full'
                                                                    src={item.avatar}
                                                                    width='128'
                                                                    height='128'
                                                                    alt={item.firstName}
                                                                />
                                                            ) : (
                                                                <Avvvatars size={128} value={`${item.firstName + ' ' + item.lastName}`} />
                                                            )}
                                                        </Link>
                                                    </div>
                                                    <div className='text-center'>
                                                        <Link
                                                            className='inline-flex text-primary hover:text-pink-500'
                                                            to={`/profile/${item.uid}`}
                                                        >
                                                            <h2 className='text-xl leading-snug justify-center font-semibold'>
                                                                {item.firstName + ' ' + item.lastName}
                                                            </h2>
                                                        </Link>
                                                    </div>
                                                    <div className='flex justify-center items-center text-sm text-secondary'>
                                                        {item.city}
                                                        {item.followers ? ' • ' : ''}
                                                        {item.followers ? item.followers + ' abonnés' : ''}
                                                    </div>
                                                    <div className='flex justify-center items-center text-sm text-secondary'>
                                                        {item.category}
                                                    </div>
                                                    <div className='flex items-center justify-center pt-2'>
                                                        {item.instagram && (
                                                            <a
                                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                                href={item.instagram}
                                                            >
                                                                <Instagram />
                                                            </a>
                                                        )}
                                                        {item.tiktok && (
                                                            <a
                                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                                href={item.tiktok}
                                                            >
                                                                <TikTok />
                                                            </a>
                                                        )}
                                                        {item.youtube && (
                                                            <a
                                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                                href={item.youtube}
                                                            >
                                                                <YouTube />
                                                            </a>
                                                        )}
                                                        {item.twitter && (
                                                            <a
                                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                                href={item.twitter}
                                                            >
                                                                <Twitter />
                                                            </a>
                                                        )}
                                                        {item.facebook && (
                                                            <a
                                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                                href={item.facebook}
                                                            >
                                                                <Facebook />
                                                            </a>
                                                        )}
                                                    </div>
                                                </header>
                                                {/* Bio */}
                                                <div className='text-center text-secondary mt-4'>
                                                    <div className='text-sm'>{item.influBio}</div>
                                                </div>
                                                  {item.minPrice && item.maxPrice && (
                                                    <div className='text-center text-secondary mt-4'>
                                                        <div className='text-sm'>Tarif : {item.minPrice}€ - {item.maxPrice}€</div>
                                                    </div>
                                                  )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default UsersTabs;
