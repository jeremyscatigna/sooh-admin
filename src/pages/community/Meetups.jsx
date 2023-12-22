import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import MeetupsPosts from '../../partials/community/MeetupsPosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../main';
import { useAtomValue } from 'jotai';
import { currentUser as userType } from '../Signup';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { categories } from '../../utils/categories';

const getLocaleDateTime = () => {
    let d = new Date();
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    return dateTimeLocalValue;
};

const filters = [
    {
        id: 'all',
        name: 'Voir tout',
    },
    {
        id: 'online',
        name: 'En ligne',
    },
    {
        id: 'instore',
        name: 'En boutique',
    },
    {
        id: 'thisweek',
        name: 'Cette semaine',
    },
    {
        id: 'favorites',
        name: 'Favoris',
    },
];

function Meetups() {
    dayjs.extend(isBetween);

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filtering, setFiltering] = useState('all');
    const [searchText, setSearchText] = useState('');

    const [data, setData] = useState([]);
    const [now, setNow] = useState([]);
    const [toCome, setToCome] = useState([]);

    const user = useAtomValue(userType);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [myHappyHours, setMyHappyHours] = useState([]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    const getDataFromTodayToNextTwoWeeks = (data) => {
        const today = dayjs();
        const nextTwoWeeks = dayjs().add(2, 'week');
        return data.filter((item) => {
            const itemDate = dayjs(item.date);
            return itemDate.isBetween(today, nextTwoWeeks, 'day', '[]'); // '[]' includes the start and end dates
        });
    };

    const getDataStartingNextTwoWeeks = (data) => {
        const nextTwoWeeks = dayjs().add(2, 'week');
        return data.filter((item) => {
            const itemDate = dayjs(item.date);
            return itemDate.isAfter(nextTwoWeeks);
        });
    };

    const replaceGetLocalDateTimeTimeByEndTime = (date, endTime) => {
        if (!endTime) return date;
        const dateArray = date.split('T');
        const timeArray = endTime.split(':');
        const newDate = new Date(dateArray[0]);
        newDate.setHours(timeArray[0]);
        newDate.setMinutes(timeArray[1]);
        return newDate.toISOString().slice(0, -5);
    };

    const isToday = (date) => {
        const today = dayjs();
        const itemDate = dayjs(date);
        return itemDate.isSame(today, 'day');
    };

    

    const getLocaleDateTimeAtBeginningOfDay = () => {
        let d = new Date();
        const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -14);
        return dateTimeLocalValue;
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        const filterMyHappyHours = (data) => {
            if (data.endTime) {
                return data.filter((item) => item.userId === user.uid).filter((item) => isToday(item.date) && dayjs().format('HH:mm') > item.endTime);
            }
            return data.filter((item) => item.userId === user.uid).filter((item) => item.date >= getLocaleDateTime());
        };
        const filterDataWhereEndTimeIsBeforeNow = (data) => {
            const now = dayjs();
            return data.filter((item) => {
                if (!item.endTime) return true;
                if (!isToday(item.date)) return true;
                if (isToday(item.date) && dayjs(item.date).format('HH:mm') < item.endTime && dayjs().format('HH:mm') > item.endTime) return false;
                const itemDate = dayjs(replaceGetLocalDateTimeTimeByEndTime(item.date, item.endTime));
                return itemDate.isAfter(now);
            });
        };
        const fetchData = async () => {
            const res = await getDocs(
                query(
                    collection(db, 'happyhours'),
                    orderBy('date', 'asc'),
                    where('date', '>=', getLocaleDateTimeAtBeginningOfDay()),
                    where('date', '!=', 'Invalid Date'),
                ),
            );
            setData(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            if (user.type === 'business') {
                setMyHappyHours(filterMyHappyHours(data));
            }
            const filteredData = filterDataWhereEndTimeIsBeforeNow(data);
            setNow(getDataFromTodayToNextTwoWeeks(filteredData));
            setToCome(getDataStartingNextTwoWeeks(filteredData));
        };
        fetchData();
    }, [user.type, user.uid]);

    const getCityFromData = (data) => {
        const cities = data.map((item) => item.city);
        const filteredCities = cities.filter((city) => city && city.trim() !== ''); // Filter out null, undefined, and empty strings
        return [...new Set(filteredCities)]; // Remove duplicates
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <div className={`px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto ${mobile && 'mb-24'}`}>
                        {/* Page header */}
                        <div className='sm:flex sm:justify-end sm:items-center mb-5'>
                            {/* Right: Actions */}
                            <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
                                {user.type === 'business' && (
                                    <button
                                        className='btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/happyhours/new');
                                        }}
                                    >
                                        <svg className='w-4 h-4 fill-current shrink-0' viewBox='0 0 16 16'>
                                            <path d='M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z' />
                                        </svg>
                                        <span className='hidden xs:block ml-2'>Happy Hour</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className='mb-5'>
                            <ul className='flex flex-wrap -m-1'>
                                {filters.map((filter) => (
                                    <li className='m-1' key={filter.id}>
                                        <button
                                            onClick={() => setFiltering(filter.id)}
                                            className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm ${
                                                filter.id === filtering ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600' : 'bg-hover'
                                            } text-primary duration-150 ease-in-out`}
                                        >
                                            {filter.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <select
                            className='form-select pr-0 rounded-full border-none bg-hover text-secondary mb-5'
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
                                className='form-select pr-6 rounded-full border-none bg-hover text-secondary mb-5 ml-2'
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

                        {user.type === 'business' && (
                            <>
                                <div className='flex items-center justify-between mb-5'>
                                    <h2 className='text-2xl font-bold text-primary'>Mes Happy Hours</h2>
                                    <span className='text-sm font-medium text-primary'>{myHappyHours.length} Happy Hours</span>
                                </div>

                                <MeetupsPosts
                                    now={now}
                                    toCome={toCome}
                                    data={myHappyHours}
                                    filtering={filtering}
                                    searchText={searchText}
                                    selectedCategory={selectedCategory}
                                    isMyHappyHours={true}
                                    myHappyHours={myHappyHours}
                                />
                            </>
                        )}

                        {/* Content */}
                        <MeetupsPosts
                            now={now}
                            toCome={toCome}
                            data={data}
                            filtering={filtering}
                            searchText={searchText}
                            selectedCategory={selectedCategory}
                            isMyHappyHours={false}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Meetups;
