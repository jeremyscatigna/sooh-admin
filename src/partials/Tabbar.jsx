import { Dashboard, Group, Home, Shop } from 'iconoir-react';
import { useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { currentUser } from '../pages/Signup';
import { Link, redirect, useLocation } from 'react-router-dom';

export const SlidingTabBar = () => {
    const tabsRef = useRef([]);
    const [activeTabIndex, setActiveTabIndex] = useState(null);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
    const user = useAtomValue(currentUser);
    // const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            redirect('/signin');
        }
    }, [user]);

    const location = useLocation();
    const { pathname } = location;

    let allTabs = [
        {
            id: 'feed',
            name: 'Feed',
            icon: (
                <svg
                    width='24px'
                    height='24px'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    color='#ffffff'
                >
                    <path
                        d='M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                    ></path>
                    <path
                        d='M13 14V14C13 11.2386 15.2386 9 18 9V9C20.7614 9 23 11.2386 23 14V14.5'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                    ></path>
                    <path
                        d='M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    ></path>
                    <path
                        d='M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    ></path>
                </svg>
            ),
        },
        {
            id: 'influencers',
            name: 'Influenceurs',
            icon: (
                <svg
                    width='24px'
                    height='24px'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    color='#ffffff'
                >
                    <path
                        d='M10.5213 2.62368C11.3147 1.75255 12.6853 1.75255 13.4787 2.62368L14.4989 3.74391C14.8998 4.18418 15.4761 4.42288 16.071 4.39508L17.5845 4.32435C18.7614 4.26934 19.7307 5.23857 19.6757 6.41554L19.6049 7.92905C19.5771 8.52388 19.8158 9.10016 20.2561 9.50111L21.3763 10.5213C22.2475 11.3147 22.2475 12.6853 21.3763 13.4787L20.2561 14.4989C19.8158 14.8998 19.5771 15.4761 19.6049 16.071L19.6757 17.5845C19.7307 18.7614 18.7614 19.7307 17.5845 19.6757L16.071 19.6049C15.4761 19.5771 14.8998 19.8158 14.4989 20.2561L13.4787 21.3763C12.6853 22.2475 11.3147 22.2475 10.5213 21.3763L9.50111 20.2561C9.10016 19.8158 8.52388 19.5771 7.92905 19.6049L6.41553 19.6757C5.23857 19.7307 4.26934 18.7614 4.32435 17.5845L4.39508 16.071C4.42288 15.4761 4.18418 14.8998 3.74391 14.4989L2.62368 13.4787C1.75255 12.6853 1.75255 11.3147 2.62368 10.5213L3.74391 9.50111C4.18418 9.10016 4.42288 8.52388 4.39508 7.92905L4.32435 6.41553C4.26934 5.23857 5.23857 4.26934 6.41554 4.32435L7.92905 4.39508C8.52388 4.42288 9.10016 4.18418 9.50111 3.74391L10.5213 2.62368Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                    ></path>
                    <path d='M9 12L11 14L15 10' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                </svg>
            ),
        },
        {
            id: 'happyhours',
            name: 'Deals',
            icon: (
                <svg
                    width='24px'
                    height='24px'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    color='#ffffff'
                >
                    <path
                        d='M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                    ></path>
                    <path
                        d='M14.8333 21V15C14.8333 13.8954 13.9379 13 12.8333 13H10.8333C9.72874 13 8.83331 13.8954 8.83331 15V21'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeMiterlimit='16'
                    ></path>
                    <path
                        d='M21.8183 9.36418L20.1243 3.43517C20.0507 3.17759 19.8153 3 19.5474 3H15.5L15.9753 8.70377C15.9909 8.89043 16.0923 9.05904 16.2532 9.15495C16.6425 9.38698 17.4052 9.81699 18 10C19.0158 10.3125 20.5008 10.1998 21.3465 10.0958C21.6982 10.0526 21.9157 9.7049 21.8183 9.36418Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                    ></path>
                    <path
                        d='M14 10C14.5675 9.82538 15.2879 9.42589 15.6909 9.18807C15.8828 9.07486 15.9884 8.86103 15.9699 8.63904L15.5 3H8.5L8.03008 8.63904C8.01158 8.86103 8.11723 9.07486 8.30906 9.18807C8.71207 9.42589 9.4325 9.82538 10 10C11.493 10.4594 12.507 10.4594 14 10Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                    ></path>
                    <path
                        d='M3.87567 3.43517L2.18166 9.36418C2.08431 9.7049 2.3018 10.0526 2.6535 10.0958C3.49916 10.1998 4.98424 10.3125 6 10C6.59477 9.81699 7.35751 9.38698 7.74678 9.15495C7.90767 9.05904 8.00913 8.89043 8.02469 8.70377L8.5 3H4.45258C4.18469 3 3.94926 3.17759 3.87567 3.43517Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                    ></path>
                </svg>
            ),
        },
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: (
                <svg
                    width='24px'
                    height='24px'
                    strokeWidth='1.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    color='#ffffff'
                >
                    <path d='M12 4L12 8' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                    <path d='M4 8L6.5 10.5' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                    <path d='M17.5 10.5L20 8' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                    <path d='M3 17H6' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                    <path d='M12 17L13 11' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                    <path d='M18 17H21' stroke='#ffffff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>
                    <path
                        d='M8.5 20.001H4C2.74418 18.3295 2 16.2516 2 14C2 8.47715 6.47715 4 12 4C17.5228 4 22 8.47715 22 14C22 16.2516 21.2558 18.3295 20 20.001L15.5 20'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    ></path>
                    <path
                        d='M12 23C13.6569 23 15 21.6569 15 20C15 18.3431 13.6569 17 12 17C10.3431 17 9 18.3431 9 20C9 21.6569 10.3431 23 12 23Z'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    ></path>
                </svg>
            ),
        },
    ];

    useEffect(() => {
        const activeTabIndex = allTabs.findIndex((tab) => `/${tab.id}` === pathname);
        if (pathname === '/') {
            setActiveTabIndex(0);
            return;
        }
        setActiveTabIndex(activeTabIndex);
    }, [pathname]);

    useEffect(() => {
        if (activeTabIndex === null) {
            return;
        }

        const setTabPosition = () => {
            const currentTab = tabsRef.current[activeTabIndex];
            setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
            setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
        };

        setTabPosition();
    }, [activeTabIndex]);

    return (
        <div className='fixed z-50 bottom-2 w-full px-4'>
            <div className='flew-row justify-center w-full relative mx-auto flex h-12 rounded-3xl border border-black/40 bg-background backdrop-blur-sm'>
                <span
                    className='absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl transition-all duration-300'
                    style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                >
                    <span className='h-full w-full rounded-3xl bg-gradient-to-r from-fuchsia-600 to-pink-600' />
                </span>
                {allTabs.map((tab, index) => {
                    const isActive = activeTabIndex === index;

                    return (
                        <Link
                            key={index}
                            to={`/${tab.id === 'feed' ? '' : tab.id}`}
                            ref={(el) => (tabsRef.current[index] = el)}
                            className={`${
                                isActive ? `` : `hover:text-neutral-300`
                            } my-auto cursor-pointer select-none rounded-full px-5 text-center font-light text-white text-xs justify-center flex items-center flex-col`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {/* <Home className='h-4 w-4' /> */}
                            {tab.icon}
                            {tab.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
