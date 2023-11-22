import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import MeetupsPosts from '../../partials/community/MeetupsPosts';
import PaginationNumeric from '../../components/PaginationNumeric';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../main';
import { useAtomValue } from 'jotai';
import { currentUser as userType } from '../Signup';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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
        id: 'thismonth',
        name: 'Ce mois',
    },
    {
        id: 'favorites',
        name: 'Favoris',
    },
];

function Meetups() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filtering, setFiltering] = useState('all');

    const [data, setData] = useState([]);

    const user = useAtomValue(userType);
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

    useEffect(() => {
        const fetchData = async () => {
            const res = await getDocs(
                query(
                    collection(db, 'happyhours'),
                    orderBy('date', 'asc'),
                    where('date', '>=', getLocaleDateTime()),
                    where('date', '!=', 'Invalid Date'),
                ),
            );
            setData(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, []);

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
                        <div className='sm:flex sm:justify-between sm:items-center mb-5'>
                            {/* Right: Actions */}
                            <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
                                {/* Search form */}
                                <SearchForm placeholder='Search…' />

                                {/* Add meetup button */}
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

                        {/* Content */}
                        <MeetupsPosts data={data} filtering={filtering} />

                        {/* Pagination */}
                        <div className='mt-8'>
                            <PaginationNumeric />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Meetups;
