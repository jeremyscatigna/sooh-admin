import { Home } from 'iconoir-react';
import React, { useEffect, useRef, useState } from 'react';

let allTabs = [
    {
        id: 'home',
        name: 'Home',
    },
    {
        id: 'blog',
        name: 'Blog',
    },
    {
        id: 'projects',
        name: 'Projects',
    },
    {
        id: 'arts',
        name: 'Arts',
    },
];

export const SlidingTabBar = () => {
    const tabsRef = useRef([]);
    const [activeTabIndex, setActiveTabIndex] = useState(null);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

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
        <div className='absolute z-50 bottom-4 left-1/2 -translate-x-1/2'>
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
                        <button
                            key={index}
                            ref={(el) => (tabsRef.current[index] = el)}
                            className={`${
                                isActive ? `` : `hover:text-neutral-300`
                            } my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-white text-xs justify-center flex items-center flex-col`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {/* <Home className='h-4 w-4' /> */}
                            {tab.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
