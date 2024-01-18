import React, { useEffect, useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { useAtomValue } from 'jotai';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../main';
import { currentUser } from './Signup';
import DashboardCardPost from '../partials/dashboard/DashboardCardPost';
import DashboardCardLikes from '../partials/dashboard/DashboardCardLikes';
import DashboardCardComments from '../partials/dashboard/DashboardCardComments';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

function DashboardInflu() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [usersPosts, setUsersPosts] = useState([]);

    const user = useAtomValue(currentUser);

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
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

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const resPosts = await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)));

            setUsersPosts(resPosts.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
                            <DashboardCardPost posts={usersPosts.length || 0} />
                            {/* Line chart (Acme Advanced) */}
                            <DashboardCardLikes likes={getNumberOfLikes(usersPosts)} />
                            {/* Line chart (Acme Professional) */}
                            <DashboardCardComments comments={getNumberOfComments(usersPosts)} />
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

export default DashboardInflu;
