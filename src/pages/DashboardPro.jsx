import React, { useEffect, useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import { useAtomValue } from 'jotai';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../main';
import { categories } from '../utils/categories';
import { currentUser } from './Signup';
import DashboardCardPost from '../partials/dashboard/DashboardCardPost';
import DashboardCardLikes from '../partials/dashboard/DashboardCardLikes';
import DashboardCardComments from '../partials/dashboard/DashboardCardComments';
import DashboardCardHappyHours from '../partials/dashboard/DashboardCardHappyHours';
import DashboardCardParticipants from '../partials/dashboard/DashboardCardParticipants';
import DashboardCardClick from '../partials/dashboard/DashboardCardClicks';
import { MeetupItem } from '../partials/community/MeetupsPosts';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function DashboardPro() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [happyHoursData, setHappyHoursData] = useState([]);
    const [happyHoursByRecurency, setHappyHoursByRecurency] = useState([]);
    const [happyHoursByCategory, setHappyHoursByCategory] = useState([]);
    const [usersPosts, setUsersPosts] = useState([]);
    const [usersByType, setUsersByType] = useState([]);
    const [happyHoursRevenueByCategory, setHappyHoursRevenueByCategory] = useState([]);

    const user = useAtomValue(currentUser);

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    const matchCategoryRevenueNumberOrZero = () => {
        const matched = [];
        categories.map((category) => {
            matched.push(happyHoursRevenueByCategory[category] || 0);
        });
        return matched;
    };

    const getNumberOfLikes = (usersPosts) => {
        let likes = 0;
        usersPosts.map((post) => {
            if (!post.likes) {
                return;
            }
            likes += post.likes.length;
        });
        return likes;
    };

    const getNumberOfComments = (usersPosts) => {
        let comments = 0;
        usersPosts.map((post) => {
            if (post.comments) {
                comments += post.comments.length;
            }
        });
        return comments;
    };

    const getDailyHappyHours = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Daily'] || 0;
    };

    const getWeeklyHappyHours = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Weekly'] || 0;
    };

    const getUniqueHappyHours = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Unique'] || 0;
    };

    const getCategoriesNumber = (happyHoursByCategory) => {
        const matched = [];
        categories.map((category) => {
            matched.push(happyHoursByCategory[category] || 0);
        });
        return matched;
    };

    const getUsersByTypeNumber = (usersByType) => {
        const matched = [];
        const types = ['user', 'business', 'influencer'];
        types.map((category) => {
            matched.push(usersByType[category] || 0);
        });

        return matched;
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        const getHappyHoursByRecurency = (happyHours) => {
            const happyHoursByRecurency = happyHours.reduce((acc, happyHour) => {
                if (acc[happyHour.recurency]) {
                    acc[happyHour.recurency] += 1;
                } else {
                    acc[happyHour.recurency] = 1;
                }
                return acc;
            }, {});

            setHappyHoursByRecurency(happyHoursByRecurency);
        };

        const getHappyHoursByCategory = (happyHours) => {
            const happyHoursByCategory = happyHours.reduce((acc, happyHour) => {
                if (acc[happyHour.category]) {
                    acc[happyHour.category] += 1;
                } else {
                    acc[happyHour.category] = 1;
                }
                return acc;
            }, {});

            setHappyHoursByCategory(happyHoursByCategory);
        };

        const fetchData = async () => {
            const res = await getDocs(query(collection(db, 'happyhours'), where('userId', '==', user.uid)));
            const resPosts = await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)));

            setHappyHoursData(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setUsersPosts(resPosts.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

            getHappyHoursByRecurency(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            getHappyHoursByCategory(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, [user.uid]);

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
                        {/* Cards */}
                        <div className='grid grid-cols-12 gap-6'>
                            {/* Line chart (Acme Plus) */}
                            <DashboardCardHappyHours happyHours={getDailyHappyHours(happyHoursByRecurency)} />
                            {/* Line chart (Acme Advanced) */}
                            <DashboardCardParticipants participants={getWeeklyHappyHours(happyHoursByRecurency)} />
                            {/* Line chart (Acme Professional) */}
                            <DashboardCardClick clicks={getUniqueHappyHours(happyHoursByRecurency)} />
                            {/* Line chart (Acme Plus) */}
                            <DashboardCardPost posts={usersPosts.length || 0} />
                            {/* Line chart (Acme Advanced) */}
                            <DashboardCardLikes likes={getNumberOfLikes(usersPosts)} />
                            {/* Line chart (Acme Professional) */}
                            <DashboardCardComments comments={getNumberOfComments(usersPosts)} />
                        </div>

                        <div className='w-full mt-8'>
                            <div className='flex items-center justify-between mb-5'>
                                <h2 className='text-2xl font-bold text-primary'>Mes Happy Hours</h2>
                                <span className='text-sm font-medium text-primary'>{happyHoursData.length} Happy Hours</span>
                            </div>
                            <div className={`grid xl:grid-cols-2 gap-6`}>
                                {happyHoursData.map((item, i) => (
                                    <MeetupItem item={item} key={`${item.uid}+${i}`} isMyHappyHour={true} />
                                ))}
                            </div>
                        </div>

                        <div className='w-full mt-8'>
                            <div className='flex items-center justify-between mb-5'>
                                <h2 className='text-2xl font-bold text-primary'>Mes Posts</h2>
                                <span className='text-sm font-medium text-primary'>{usersPosts.length} Posts</span>
                            </div>
                            <div className={`grid xl:grid-cols-2 gap-6`}>
                                {usersPosts.map((item, i) => (
                                    <article
                                        className={`flex bg-card ${
                                            window.innerWidth <= 500 && 'h-38'
                                        } shadow-lg rounded-lg overflow-hidden`}
                                        key={item.uid}
                                    >
                                        {item.imageUrl && (
                                            <div className='relative block w-32 sm:w-56 xl:sidebar-expanded:w-40 2xl:sidebar-expanded:w-56 shrink-0'>
                                                <video
                                                    className='absolute object-cover object-center w-full h-full'
                                                    width='590'
                                                    height='332'
                                                    poster={item.imageUrl}
                                                    src={item.imageUrl}
                                                    muted
                                                    autoPlay
                                                    playsInline
                                                    loop
                                                ></video>
                                            </div>
                                        )}
                                        {/* Content */}
                                        <div className='grow p-5 flex flex-col'>
                                            <div className='grow mb-2'>
                                                <div className='text-xs font-semibold text-pink-500 uppercase mb-2'>
                                                    Il y a {dayjs(item.date).fromNow(true)}
                                                </div>
                                                <Link className='inline-flex' to={`/happyhours/${item.uid}`}>
                                                    <h3 className='text-sm font-bold text-primary'>
                                                        {item.userFirstName} {item.userLastName}
                                                    </h3>
                                                </Link>
                                                <p className='text-secondary text-xs flex row mt-1'>{item.text}</p>
                                                <div className='flex space-x-2 mt-2'>
                                                    <span className='text-xs font-semibold text-secondary mb-1'>
                                                        {item.likes ? item.likes.length : '0'} Likes
                                                    </span>
                                                    <span className='text-xs font-semibold text-secondary mb-1'>
                                                        {item.comments ? item.comments.length : '0'} Comments
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardPro;
