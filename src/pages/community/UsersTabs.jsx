import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../main';
import { getCategoriesShadowColor } from '../../utils/categories';
import { Link } from 'react-router-dom';
import Avvvatars from 'avvvatars-react';
import { Search } from 'iconoir-react';

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
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
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
                                                <header>
                                                    <div className='flex justify-center mb-2'>
                                                        <Link className='relative inline-flex items-start' to={`/profile/${item.uid}`}>
                                                            {item.avatar !== '' ? (
                                                                <img
                                                                    className='rounded-full'
                                                                    src={item.avatar}
                                                                    width='64'
                                                                    height='64'
                                                                    alt={item.firstName}
                                                                />
                                                            ) : (
                                                                <Avvvatars size={64} value={`${item.firstName + ' ' + item.lastName}`} />
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
                                                        {item.followers}
                                                    </div>
                                                    <div className='flex justify-center items-center text-sm text-secondary'>
                                                        {item.category}
                                                    </div>
                                                </header>
                                                {/* Bio */}
                                                <div className='text-center text-secondary mt-4'>
                                                    <div className='text-sm'>{item.influBio}</div>
                                                </div>
                                            </div>
                                            {/* Card footer */}
                                            <div className=''>
                                                <Link
                                                    className='block text-center text-sm text-primary hover:text-pink-500 font-medium px-3 py-4'
                                                    to='/messages'
                                                >
                                                    <div className='flex items-center justify-center'>
                                                        <svg className='w-4 h-4 fill-current shrink-0 mr-2' viewBox='0 0 16 16'>
                                                            <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                                                        </svg>
                                                        <span>Envoyer un message</span>
                                                    </div>
                                                </Link>
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
