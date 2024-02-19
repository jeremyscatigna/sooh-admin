import React, { useEffect, useRef, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import FeedLeftContent from '../../partials/community/FeedLeftContent';
import FeedPosts from '../../partials/community/FeedPosts';
import FeedRightContent from '../../partials/community/FeedRightContent';

import { useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../../main';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Avvvatars from 'avvvatars-react';
import { Link } from 'react-router-dom';
import { MediaImage, Message, Search, Settings } from 'iconoir-react';
import ModalBlank from '../../components/ModalBlank';

function Feed() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [data, setData] = useState([]);

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);
    const [fileType, setFileType] = useState('image');

    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [apercuModalOpen, setApercuModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

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
    // const user = JSON.parse(localStorage.getItem('user'));
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

    useEffect(() => {
        if (searchText.trim()) {
            const lowercasedFilter = searchText.toLowerCase();
            const filteredItems = data.filter((item) => {
                // Assuming you want to search in the text of the post. Adjust accordingly
                return item.text.toLowerCase().includes(lowercasedFilter);
            });
            setFilteredData(filteredItems);
        } else {
            setFilteredData(data);
        }
    }, [searchText, data]);

    const handleUpload = (e) => {
        e.preventDefault();
        setFileLoading(true);
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;
        const storageRef = ref(storage, `posts/${uuidv4()}`);
        console.log(storageRef);
        const isVideo = file.type === 'video/mp4' || file.type === 'video/quicktime';
        if (isVideo) {
            setFileType('video');
        } else {
            setFileType('image');
        }
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
            fileType: fileType,
            userId: currentUserAuth.uid,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            username: user.username || '',
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
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 md:py-0 w-full max-w-9xl mx-auto'>
                        <div className='xl:flex'>
                            {/* Left + Middle content */}
                            <div className='md:flex flex-1'>
                                {/* Left content */}
                                {!mobile && <FeedLeftContent />}
                                {mobile && (
                                    <header className='mb-6 flex flex-row w-full justify-between'>
                                        <div className='flex flex-row space-x-2'>
                                            <Link
                                                className='flex items-center justify-center p-2 rounded-full bg-card'
                                                to={`/profile/${user.uid}`}
                                            >
                                                <svg className='w-4 h-4 shrink-0 fill-current text-primary' viewBox='0 0 16 16'>
                                                    <path d='M12.311 9.527c-1.161-.393-1.85-.825-2.143-1.175A3.991 3.991 0 0012 5V4c0-2.206-1.794-4-4-4S4 1.794 4 4v1c0 1.406.732 2.639 1.832 3.352-.292.35-.981.782-2.142 1.175A3.942 3.942 0 001 13.26V16h14v-2.74c0-1.69-1.081-3.19-2.689-3.733zM6 4c0-1.103.897-2 2-2s2 .897 2 2v1c0 1.103-.897 2-2 2s-2-.897-2-2V4zm7 10H3v-.74c0-.831.534-1.569 1.33-1.838 1.845-.624 3-1.436 3.452-2.422h.436c.452.986 1.607 1.798 3.453 2.422A1.943 1.943 0 0113 13.26V14z' />
                                                </svg>
                                            </Link>
                                            <Link className='flex items-center justify-center p-2 rounded-full bg-card' to={`/messages`}>
                                                <Message className='w-4 h-4 shrink-0 text-primary' />
                                            </Link>
                                        </div>
                                    </header>
                                )}

                                {/* Middle content */}
                                <div className='flex-1 md:ml-8 xl:mx-4 2xl:mx-8'>
                                    <ModalBlank
                                        id='basic-modal'
                                        className='bg-card rounded-xl'
                                        modalOpen={apercuModalOpen}
                                        setModalOpen={setApercuModalOpen}
                                    >
                                        <div className='p-5 flex flex-col space-y-4 justify-center items-center bg-card rounded-xl'>
                                            <div className='w-full flex justify-start items-start'>
                                                <p className='text-sm text-primary text-center mb-2'>{postText}</p>
                                            </div>
                                            <video
                                                className='block w-full'
                                                width='590'
                                                height='332'
                                                poster={imgUrl}
                                                src={imgUrl}
                                                muted
                                                autoPlay
                                                playsInline
                                                loop
                                            ></video>

                                            {/* Modal footer */}
                                            <div className='flex justify-end items-start w-full space-x-2 pb-10'>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setApercuModalOpen(false);
                                                    }}
                                                    className='btn-sm text-primary border border-primary whitespace-nowrap rounded-lg'
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCreate();
                                                        setPostText('');
                                                        setPostImage(null);
                                                        setApercuModalOpen(false);
                                                    }}
                                                    className='btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary whitespace-nowrap rounded-lg'
                                                >
                                                    Envoyer
                                                </button>
                                            </div>
                                        </div>
                                    </ModalBlank>
                                    <div className='md:py-8'>
                                        {/* Blocks */}
                                        <div className='space-y-4'>
                                            <form className='relative'>
                                                <label htmlFor='feed-search-desktop' className='sr-only'>
                                                    Search
                                                </label>
                                                <input
                                                    id='feed-search-desktop'
                                                    className='form-input bg-hover text-secondary border-none rounded-full w-full pl-9 focus:border-slate-300'
                                                    type='search'
                                                    placeholder='Rechercher…'
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                                <button className='absolute inset-0 right-auto group' type='submit' aria-label='Search'>
                                                    <Search className='w-4 h-4 shrink-0 text-secondary group-hover:text-slate-500 ml-3 mr-2' />
                                                </button>
                                            </form>

                                            {/* Post Block */}
                                            <div className='bg-card shadow-md rounded-xl p-5'>
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
                                                            Quoi de neuf,{' '}
                                                            {user.username && user.username !== '' ? user.username : user.firstName}?
                                                        </label>
                                                        <input
                                                            id='status-input'
                                                            className='form-input w-full bg-hover text-secondary border-none rounded-full placeholder-secondary'
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
                                                            className='inline-flex items-center text-sm font-medium text-secondary hover:text-slate-700'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                inputRef.current.click();
                                                            }}
                                                        >
                                                            {!imgUrl ? (
                                                                <MediaImage className='w-5 h-5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded mr-2' />
                                                            ) : (
                                                                <div className='pr-3'>
                                                                    <img src={imgUrl} alt='uploaded file' className='w-10 h-10' />
                                                                </div>
                                                            )}

                                                            <span>{fileLoading ? 'Loading' : ' Ajouter un média'}</span>
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
                                                            className='btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary whitespace-nowrap rounded-lg'
                                                            onClick={(e) => {
                                                                if (imgUrl) {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    setApercuModalOpen(true);
                                                                } else {
                                                                    e.preventDefault();
                                                                    handleCreate();
                                                                    setPostText('');
                                                                    setPostImage(null);
                                                                }
                                                            }}
                                                        >
                                                            {loading ? 'Loading...' : imgUrl ? 'Apercu' : 'Envoyer'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Posts */}
                                            <FeedPosts posts={filteredData} />
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
