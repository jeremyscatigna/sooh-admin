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
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

function Feed() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [data, setData] = useState([]);

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);

    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const user = useAtomValue(currentUser);
    const currentUserAuth = auth.currentUser;

    useEffect(() => {
      const fetchData = async () => {
          const res = await getDocs(collection(db, 'posts'));
          console.log(res.docs.map((doc) => doc.data()));
          setData(res.docs.map((doc) => doc.data()));
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

        setData([...data, toAdd]);
        setImgUrl(null);
        setPostText('');
        setLoading(false);
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
                                                    <img
                                                        className='rounded-full shrink-0'
                                                        src={Avatar}
                                                        width='40'
                                                        height='40'
                                                        alt='User 02'
                                                    />
                                                    <div className='grow'>
                                                        <label htmlFor='status-input' className='sr-only'>
                                                            What's happening, {user.firstName}?
                                                        </label>
                                                        <input
                                                            id='status-input'
                                                            className='form-input w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 placeholder-slate-500'
                                                            type='text'
                                                            placeholder={`What's happening, ${user.firstName}?`}
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

                                                            <span>{fileLoading ? 'Loading' : ' Media'}</span>
                                                        </button>
                                                        <input
                                                            ref={inputRef}
                                                            type='file'
                                                            id='file'
                                                            className='hidden'
                                                            onChange={handleUpload}
                                                        />
                                                        <button className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700'>
                                                            <svg
                                                                className='w-4 h-4 fill-indigo-400 mr-2'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                            >
                                                                <path d='M6.974 14c-.3 0-.7-.2-.9-.5l-2.2-3.7-2.1 2.8c-.3.4-1 .5-1.4.2-.4-.3-.5-1-.2-1.4l3-4c.2-.3.5-.4.9-.4.3 0 .6.2.8.5l2 3.3 3.3-8.1c0-.4.4-.7.8-.7s.8.2.9.6l4 8c.2.5 0 1.1-.4 1.3-.5.2-1.1 0-1.3-.4l-3-6-3.2 7.9c-.2.4-.6.6-1 .6Z' />
                                                            </svg>
                                                            <span>GIF</span>
                                                        </button>
                                                        <button className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-700'>
                                                            <svg
                                                                className='w-4 h-4 fill-indigo-400 mr-2'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                            >
                                                                <path d='M9.793 10.002a.5.5 0 0 1 .353.853l-1.792 1.793a.5.5 0 0 1-.708 0l-1.792-1.793a.5.5 0 0 1 .353-.853h3.586Zm5.014-4.63c1.178 2.497 1.833 5.647.258 7.928-1.238 1.793-3.615 2.702-7.065 2.702S2.173 15.092.935 13.3c-1.575-2.28-.92-5.431.258-7.927A2.962 2.962 0 0 1 0 3.002a3 3 0 0 1 3-3c.787 0 1.496.309 2.029.806a5.866 5.866 0 0 1 5.942 0A2.96 2.96 0 0 1 13 .002a3 3 0 0 1 3 3c0 .974-.472 1.827-1.193 2.37Zm-1.387 6.79c1.05-1.522.417-3.835-.055-5.078C12.915 5.89 11.192 2.002 8 2.002s-4.914 3.89-5.365 5.082c-.472 1.243-1.106 3.556-.055 5.079.843 1.22 2.666 1.839 5.42 1.839s4.577-.62 5.42-1.84ZM6.67 6.62c.113.443.102.68-.433 1.442-.535.761-1.06 1.297-1.658 1.297-.597 0-1.08-.772-1.07-1.483.01-.71.916-2.306 1.997-2.306.784 0 1.05.607 1.163 1.05Zm3.824-1.05c1.08 0 1.987 1.596 1.997 2.306.01.71-.473 1.483-1.07 1.483-.598 0-1.123-.536-1.658-1.297-.535-.762-.546-1-.432-1.442.113-.443.38-1.05 1.163-1.05Z' />
                                                            </svg>
                                                            <span>Emoji</span>
                                                        </button>
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
