import React, { useEffect, useRef, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import FeedLeftContent from '../../partials/community/FeedLeftContent';
import FeedPosts from '../../partials/community/FeedPosts';
import FeedRightContent from '../../partials/community/FeedRightContent';

import Avatar from '../../images/user-40-02.jpg';
import { useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../../main';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Avvvatars from 'avvvatars-react';
import { SlidingTabBar } from '../../partials/Tabbar';

function Feed() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [data, setData] = useState([]);

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);

    const [loading, setLoading] = useState(false);
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

    const inputRef = useRef(null);

    const user = useAtomValue(currentUser);
    const currentUserAuth = auth.currentUser;

    useEffect(() => {
        const fetchData = async () => {
            const res = await getDocs(query(collection(db, 'posts'), orderBy('timestamp', 'desc')));

            res.docs.forEach(async () => {
                setData(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            });
        };
        fetchData();
    }, []);

    const handleUpload = (e) => {
        e.preventDefault();
        setFileLoading(true);
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;
        const storageRef = ref(storage, `posts/${uuidv4()}`);
        console.log(storageRef);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                setFileLoading(false);
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setFileLoading(false);
                    setImgUrl(downloadURL);
                });
            },
        );
    };

    const handleCreate = async () => {
        setLoading(true);
        const toAdd = {
            uid: uuidv4(),
            text: postText,
            imageUrl: imgUrl,
            userId: currentUserAuth.uid,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            userAvatar: user.avatar,
            date: new Date(new Date().setDate(new Date().getDate())).toString(),
            likes: [],
            comments: [],
            timestamp: serverTimestamp(),
        };

        console.log(toAdd);
        try {
            await addDoc(collection(db, 'posts'), {
                ...toAdd,
            });
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

        setData([toAdd, ...data]);
        setImgUrl(null);
        setPostText('');
        setLoading(false);
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {mobile ? (
                <SlidingTabBar />
            ): (
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            )}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                {!mobile && (
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                )}

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 md:py-0 w-full max-w-9xl mx-auto'>
                        <div className='xl:flex'>
                            {/* Left + Middle content */}
                            <div className='md:flex flex-1'>
                                {/* Left content */}
                                <FeedLeftContent />

                                {/* Middle content */}
                                <div className='flex-1 md:ml-8 xl:mx-4 2xl:mx-8'>
                                    <div className='md:py-8'>
                                        {/* Blocks */}
                                        <div className='space-y-4'>
                                            <form className='relative'>
                                                <label htmlFor='feed-search-desktop' className='sr-only'>
                                                    Search
                                                </label>
                                                <input
                                                    id='feed-search-desktop'
                                                    className='form-input w-full pl-9 focus:border-slate-300'
                                                    type='search'
                                                    placeholder='Search…'
                                                />
                                                <button className='absolute inset-0 right-auto group' type='submit' aria-label='Search'>
                                                    <svg
                                                        className='w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2'
                                                        viewBox='0 0 16 16'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                    >
                                                        <path d='M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z' />
                                                        <path d='M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z' />
                                                    </svg>
                                                </button>
                                            </form>

                                            {/* Post Block */}
                                            <div className='bg-white shadow-md rounded border border-slate-200 p-5'>
                                                <div className='flex items-center space-x-3 mb-5'>
                                                    {user.avatar ? (
                                                        <img
                                                            className='rounded-full shrink-0'
                                                            src={user.avatar}
                                                            width='40'
                                                            height='40'
                                                            alt='User 02'
                                                        />
                                                    ) : (
                                                        <Avvvatars value={`${user.firstName} ${user.lastName}`} />
                                                    )}

                                                    <div className='grow'>
                                                        <label htmlFor='status-input' className='sr-only'>
                                                            What's happening, {user.firstName}?
                                                        </label>
                                                        <input
                                                            id='status-input'
                                                            className='form-input w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 placeholder-slate-500'
                                                            type='text'
                                                            placeholder={`Que se passe-t-il, ${user.firstName}?`}
                                                            value={postText}
                                                            onChange={(e) => setPostText(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <div className='grow flex space-x-5'>
                                                        <button
                                                            className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                inputRef.current.click();
                                                            }}
                                                        >
                                                            {!imgUrl ? (
                                                                <svg
                                                                    className='w-4 h-4 fill-indigo-400 mr-2'
                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                >
                                                                    <path d='M0 0h2v16H0V0Zm14 0h2v16h-2V0Zm-3 7H5c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1ZM6 5h4V2H6v3Zm5 11H5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1Zm-5-2h4v-3H6v3Z' />
                                                                </svg>
                                                            ) : (
                                                                <div className='pr-3'>
                                                                    <img src={imgUrl} alt='uploaded file' className='w-10 h-10' />
                                                                </div>
                                                            )}

                                                            <span>{fileLoading ? 'Loading' : ' Image'}</span>
                                                        </button>
                                                        <input
                                                            ref={inputRef}
                                                            type='file'
                                                            id='file'
                                                            className='hidden'
                                                            onChange={handleUpload}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button
                                                            type='submit'
                                                            className='btn-sm bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap'
                                                            onClick={(e) => {
                                                                e.preventDefault();

                                                                handleCreate();

                                                                setPostText('');
                                                                setPostImage(null);
                                                            }}
                                                        >
                                                            {loading ? 'Loading...' : 'Send'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Posts */}
                                            <FeedPosts posts={data} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right content */}
                            <FeedRightContent />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Feed;
