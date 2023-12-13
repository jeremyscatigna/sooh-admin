import { Group, Home } from 'iconoir-react';
import { useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { currentUser } from '../pages/Signup';
import { Link, useLocation } from 'react-router-dom';

export const SlidingTabBar = () => {
    const tabsRef = useRef([]);
    const [activeTabIndex, setActiveTabIndex] = useState(null);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
    const user = useAtomValue(currentUser);

    const location = useLocation();
    const { pathname } = location;

    let allTabs = [
        {
            id: 'feed',
            name: 'Feed',
        },
        user.type === 'business' &&
        {
            id: 'influencers',
            name: 'Influenceurs',
        },
        {
            id: 'happyhours',
            name: 'Deals',
        },
        user.type === 'business' &&
        {
            id: 'dashboard',
            name: 'Dashboard',
        },
        user.type === 'influencer' &&
        {
            id: 'dashboard',
            name: 'Dashboard',
        },
    ];

    useEffect(() => {
        const activeTabIndex = allTabs.findIndex((tab) => `/${tab.id}` === pathname);
        if(pathname === "/") {
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
        <div className='fixed z-50 bottom-2 left-1/2 -translate-x-1/2'>
            <div className='flew-row relative mx-auto flex h-12 rounded-3xl border border-black/40 bg-background px-2 backdrop-blur-sm'>
                <span
                    className='absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300'
                    style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                >
                    <span className='h-full w-full rounded-3xl bg-gradient-to-r from-fuchsia-600 to-pink-600' />
                </span>
                {allTabs.map((tab, index) => {
                    const isActive = activeTabIndex === index;

                    return (
                        <Link
                            key={index}
                            to={`/${tab.id === "feed" ? "" : tab.id}`}
                            ref={(el) => (tabsRef.current[index] = el)}
                            className={`${
                                isActive ? `` : `hover:text-neutral-300`
                            } my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-white text-xs justify-center flex items-center flex-col`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {/* <Home className='h-4 w-4' /> */}
                            {tab.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
