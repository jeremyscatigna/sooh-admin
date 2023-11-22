import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ProfileBody from '../../partials/community/ProfileBody';
import { useParams } from 'react-router-dom';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../../main';
import ModalBasic from '../../components/ModalBasic';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [basicModalOpen, setBasicModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);

    const { id } = useParams();

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
        const collectionQuery = query(collection(db, 'users'), where('uid', '==', id));

        const unsub = onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUser(data[0]);
            setFirstName(data[0].firstName);
            setLastName(data[0].lastName);
            setEmail(data[0].email);
            setDetails(data[0].details);
            setDescription(data[0].description);
            setLocation(data[0].location);
            setImgUrl(data[0].avatar);
        });

        return () => {
            unsub();
        };
    }, []);

    useEffect(() => {
        const collectionQuery = query(collection(db, 'posts'), where('userId', '==', id));

        const unsub = onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(data);
        });

        return () => {
            unsub();
        };
    }, []);

    const handleUpload = (e) => {
        e.preventDefault();
        setFileLoading(true);
        const file = e.target[0]?.files[0];
        if (!file) return;
        const storageRef = ref(storage, `users/${user.id}`);
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
                    setFileLoading(false);
                    setImgUrl(downloadURL);
                });
            },
        );
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userColRef = doc(db, 'users', user.id);

        const updatedUser = {
            firstName,
            lastName,
            email,
            details,
            description,
            avatar: imgUrl || '',
        };

        await updateDoc(userColRef, {
            ...updatedUser,
        });

        setLoading(false);
        setBasicModalOpen(false);
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-background'>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <ModalBasic id='basic-modal' modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title='Modifie ton profil'>
                        {/* Modal content */}
                        <div className='px-5 pt-4 pb-1 space-y-4'>
                            {!imgUrl && (
                                <form onSubmit={handleUpload} className='flex flex-col justify-center items-start'>
                                    <label className='block text-sm font-medium mb-1' htmlFor='file'>
                                        Photo de profil
                                    </label>
                                    <div className='flex flex-row justify-between items-center w-full'>
                                        <input
                                            className='block border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 file:bg-transparent file:border-0 file:bg-gray-100 file:mr-4 file:py-3 file:px-4'
                                            type='file'
                                        />
                                        <button className='btn py-3 bg-indigo-500 hover:bg-indigo-600 text-white' type='submit'>
                                            {fileLoading ? 'Chargement...' : 'Télécharger'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {imgUrl && <img src={imgUrl} alt='uploaded file' height={200} />}

                            <div>
                                <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                                    Prénom
                                </label>
                                <input
                                    id='placeholder'
                                    className='form-input rounded-full border-none bg-hover text-secondary placeholder-secondary w-full'
                                    type='text'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder='Add the name of your Happy Hour'
                                />
                            </div>

                            <div>
                                <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                                    Nom
                                </label>
                                <input
                                    id='placeholder'
                                    className='form-input rounded-full border-none bg-hover text-secondary placeholder-secondary w-full'
                                    type='text'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder='Add the name of your Happy Hour'
                                />
                            </div>
                            <div>
                                <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                                    Email
                                </label>
                                <input
                                    id='placeholder'
                                    className='form-input rounded-full border-none bg-hover text-secondary placeholder-secondary w-full'
                                    type='text'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Add the name of your Happy Hour'
                                />
                            </div>
                            <div>
                                <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                                    Bio
                                </label>
                                <input
                                    id='placeholder'
                                    className='form-input rounded-full border-none bg-hover text-secondary placeholder-secondary w-full'
                                    type='text'
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder='Ecris une petite bio'
                                />
                            </div>

                            <div>
                                <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                                    À propos de moi
                                </label>
                                <textarea
                                    id='placeholder'
                                    className='form-input rounded-xl border-none bg-hover text-secondary placeholder-secondary w-full'
                                    type='text'
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Ajoute le plus de details possible'
                                />
                            </div>
                        </div>
                        {/* Modal footer */}
                        <div className='px-5 py-4 mb-24'>
                            <div className='flex flex-wrap justify-end space-x-2'>
                                <button
                                    className='btn-sm border-primary hover:border-primary text-primary'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBasicModalOpen(false);
                                    }}
                                >
                                    Fermer
                                </button>
                                <button
                                    className='btn-sm rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditProfile(e);
                                    }}
                                >
                                    {loading ? 'Chargement en cours...' : 'Mettre a jour'}
                                </button>
                            </div>
                        </div>
                    </ModalBasic>
                    <div className='relative flex justify-center items-center'>
                        <ProfileBody
                            user={user}
                            posts={posts}
                            editProfile={handleEditProfile}
                            setBasicModalOpen={setBasicModalOpen}
                            profileSidebarOpen={profileSidebarOpen}
                            setProfileSidebarOpen={setProfileSidebarOpen}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
