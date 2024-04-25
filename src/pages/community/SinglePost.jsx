import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../main';
import Avvvatars from 'avvvatars-react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Heart, ShareIos } from 'iconoir-react';

function SinglePost() {
    const { id } = useParams();
    
    const [post, setPost] = useState([]);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);

    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

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
        const collectionQuery = query(collection(db, 'posts'), where('uid', '==', id));

        const unsub = onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPost(data[0] || null);
        });

        return () => unsub();
    }, []);

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                <main>
                    <div className={`px-4 sm:px-6 lg:px-8 py-8 w-full ${mobile && 'mb-24'}`}>
                        {/* Page content */}
                        <div className='max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16'>
                            <div key={post.uid} className='bg-card shadow-md rounded-xl p-5'>
                                {/* Header */}
                                <header className='flex justify-between items-start space-x-3 mb-3'>
                                    {/* User */}
                                    <div className='flex items-start space-x-3'>
                                        {post.userAvatar ? (
                                            <img
                                                className='rounded-full shrink-0 object-fit w-10 h-10'
                                                src={post.userAvatar}
                                                width='40'
                                                height='40'
                                                alt='User 08'
                                            />
                                        ) : (
                                            <Avvvatars value={`${post.userFirstName} ${post.userLastName}`} />
                                        )}

                                        <div>
                                            <div className='leading-tight'>
                                                <Link className='text-sm font-semibold text-primary' to={`profile/${post.userId}`}>
                                                    {post.username && post.username !== ''
                                                        ? post.username
                                                        : post.userFirstName + ' ' + post.userLastName}
                                                </Link>
                                            </div>
                                            <div className='text-xs text-secondary'>Il y a {dayjs(post.date).fromNow(true)}</div>
                                        </div>
                                    </div>
                                </header>
                                <div className='text-sm text-primary space-y-2 mb-5'>
                                    <p>{post.text}</p>
                                    {post.imageUrl && (
                                        <div className='relative flex items-center justify-center !my-4'>
                                            {post.fileType && post.fileType === 'image' ? (
                                                <img className='block w-full' src={post.imageUrl} width='590' height='332' alt='Post' />
                                            ) : (
                                                <video
                                                    className='block w-full'
                                                    width='590'
                                                    height='332'
                                                    poster={post.imageUrl}
                                                    src={post.imageUrl}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    loop
                                                    controls
                                                ></video>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <footer className='flex items-center space-x-4'>
                                    <button className={`flex items-center text-secondary`}>
                                        <Heart className={`w-4 h-4 shrink-0 fill-current mr-1.5`} />
                                        <div className={`text-sm 'text-secondary`}>{post.likes ? post.likes.length : 0}</div>
                                    </button>

                                    <button className='flex items-center text-secondary hover:text-pink-500'>
                                        <svg className='w-4 h-4 shrink-0 fill-current mr-1.5' viewBox='0 0 16 16'>
                                            <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                                        </svg>
                                        <div className='text-sm text-secondary'>{(post.comments && post.comments.length) || 0}</div>
                                    </button>
                                    <button className='flex items-center text-secondary'>
                                        <ShareIos className='w-5 h-4 shrink-0 font-bold' strokeWidth={3} />
                                    </button>
                                </footer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SinglePost;
