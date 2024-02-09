import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../main';
import { categories, getCategoriesShadowColor } from '../../utils/categories';
import { Link, useSearchParams } from 'react-router-dom';
import Avvvatars from 'avvvatars-react';
import { Facebook, Instagram, Search, TikTok, Twitter, YouTube } from 'iconoir-react';
import { useAtom, useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import { conversationsAtom } from '../Messages';

function UsersTabs() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedFollowers, setSelectedFollowers] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');

    const [searchText, setSearchText] = useState('');

    const authenticatedUser = useAtomValue(currentUser);
    const [conversations, setConversations] = useAtom(conversationsAtom);

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

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const getCityFromData = (data) => {
        const cities = data.map((item) => item.city);
        const filteredCities = cities.filter((city) => city && city.trim() !== ''); // Filter out null, undefined, and empty strings
        return [...new Set(filteredCities)]; // Remove duplicates
    };

    const getFollowersFromData = (data) => {
        const followers = data.map((item) => item.followers);
        const filteredFollowers = followers.filter((followers) => followers && followers.trim() !== ''); // Filter out null, undefined, and empty strings
        return [...new Set(filteredFollowers)]; // Remove duplicates
    };

    useEffect(() => {
        const fetchConversations = async () => {
            const res = await getDocs(collection(db, `users/${authenticatedUser.uid}/conversations`));

            const conversations = res.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))

            setConversations(conversations);
        };

        if (conversations === undefined || conversations.length === 0) {
            fetchConversations();
        }
    }, [conversations]);


    const goToConversationOrMessages = (userId) => {
        let link
        const conversation = conversations.find((conv) => conv.userId === userId);
        console.log(conversation);
        if (conversation) {
            link = `/messages?conversation=${conversation.uid}`;
            searchParams.set('conversation', conversation.uid);
        } else {
            link = `/messages`;
        }
        return link;
    }

    const filteredData = data.filter((item) => {
        // Assuming 'firstName' and 'lastName' are the fields you want to search.
        // Modify as per your data structure.
        if (selectedCategory && selectedCategory !== item.category) return false;
        if (selectedCity && selectedCity !== item.city) return false;
        if (selectedFollowers && selectedFollowers !== item.followers) return false;
        if (selectedPrice && !item.maxPrice) return false;
        if (item.maxPrice) {
            if (selectedPrice && Number(selectedPrice) > Number(item.maxPrice.replace(/\D/g, ''))) return false;
        }
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
                                <div className='flex flex-wrap -m-1'>
                                    <form className='m-1'>
                                        <label htmlFor='feed-search-desktop' className='sr-only'>
                                            Search
                                        </label>
                                        <input
                                            id='feed-search-desktop'
                                            className='form-input bg-hover text-secondary border-none rounded-full w-full pl-3 focus:border-slate-300'
                                            type='search'
                                            placeholder='Rechercher…'
                                            value={searchText}
                                            onChange={handleSearchChange}
                                        />
                                    </form>

                                    <select
                                        className='form-select m-1 pr-0 rounded-full border-none bg-hover text-secondary mb-5'
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value=''>Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>

                                    {getCityFromData(data).length >= 1 && (
                                        <select
                                            className='form-select m-1 pr-6 rounded-full border-none bg-hover text-secondary mb-5'
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                        >
                                            <option value=''>Villes</option>
                                            {getCityFromData(data).map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {getFollowersFromData(data).length >= 1 && (
                                        <select
                                            className='form-select m-1 pr-8 rounded-full border-none bg-hover text-secondary mb-5'
                                            value={selectedFollowers}
                                            onChange={(e) => setSelectedFollowers(e.target.value)}
                                        >
                                            <option value=''>Followers</option>
                                            {getFollowersFromData(data).map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    <select
                                        className='form-select m-1 pr-8 rounded-full border-none bg-hover text-secondary mb-5'
                                        value={selectedPrice}
                                        onChange={(e) => setSelectedPrice(e.target.value)}
                                    >
                                        <option value=''>Prix max</option>
                                        <option value='50'>50€</option>
                                        <option value='100'>100€</option>
                                        <option value='200'>200€</option>
                                        <option value='300'>300€</option>
                                        <option value='400'>400€</option>
                                        <option value='500'>500€</option>
                                        <option value='600'>600€</option>
                                        <option value='700'>700€</option>
                                        <option value='800'>800€</option>
                                        <option value='900'>900€</option>
                                        <option value='1000'>1000€</option>
                                        <option value='2000'>1000€+</option>
                                    </select>
                                </div>
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
                                                    {/* <button
                                                        className='absolute right-0 top-0 hover:text-pink-500 z-60'
                                                        onClick={(e) => {
                                                            false;
                                                        }}
                                                    >
                                                        <div className=' text-slate-100 bg-slate-900 bg-opacity-60 rounded-full'>
                                                            <span className='sr-only'>Like</span>
                                                            <svg className={`h-8 w-8`} fill={'white'} viewBox='0 0 32 32'>
                                                                <path d='M22.682 11.318A4.485 4.485 0 0019.5 10a4.377 4.377 0 00-3.5 1.707A4.383 4.383 0 0012.5 10a4.5 4.5 0 00-3.182 7.682L16 24l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L16 21.247l-5.285-5A2.5 2.5 0 0112.5 12c1.437 0 2.312.681 3.5 2.625C17.187 12.681 18.062 12 19.5 12a2.5 2.5 0 011.785 4.251h-.003z' />
                                                            </svg>
                                                        </div>
                                                    </button> */}
                                                    <Link className='absolute left-2 top-2 hover:text-pink-500 z-60' to={goToConversationOrMessages(item.uid)}>
                                                        <svg className='w-4 h-4 fill-current shrink-0' viewBox='0 0 16 16'>
                                                            <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                                                        </svg>
                                                    </Link>
                                                    <div className='flex justify-center mb-2'>
                                                        <Link className='relative inline-flex items-start' to={`/profile/${item.uid}`}>
                                                            {item.avatar !== '' ? (
                                                                <img
                                                                    className='rounded-full max-w-32 max-h-32 w-32 h-32 object-cover shadow-lg border-4 border-white'
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
                                                                {item.username && item.username !== '' ? item.username : item.firstName + ' ' + item.lastName}
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
                                                                <svg
                                                                    className='h-5 w-5'
                                                                    width='24px'
                                                                    height='24px'
                                                                    viewBox='0 0 24 24'
                                                                    strokeWidth='1.5'
                                                                    fill='none'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                    color='#ec489a'
                                                                >
                                                                    <path
                                                                        d='M16.8198 20.7684L3.75317 3.96836C3.44664 3.57425 3.72749 3 4.22678 3H6.70655C6.8917 3 7.06649 3.08548 7.18016 3.23164L20.2468 20.0316C20.5534 20.4258 20.2725 21 19.7732 21H17.2935C17.1083 21 16.9335 20.9145 16.8198 20.7684Z'
                                                                        stroke='#ec489a'
                                                                        strokeWidth='1.5'
                                                                    ></path>
                                                                    <path
                                                                        d='M20 3L4 21'
                                                                        stroke='#ec489a'
                                                                        strokeWidth='1.5'
                                                                        strokeLinecap='round'
                                                                    ></path>
                                                                </svg>
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
                                                        <div className='text-sm'>
                                                            Tarif : {item.minPrice}€ - {item.maxPrice}€
                                                        </div>
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
