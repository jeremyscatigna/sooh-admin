import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import MeetupsPosts from '../../partials/community/MeetupsPosts';
import PaginationNumeric from '../../components/PaginationNumeric';
import ModalBasic from '../../components/ModalBasic';
import Datepicker from '../../components/Datepicker';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db, storage } from '../../main';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useAtomValue } from 'jotai';
import { currentUser as userType } from '../Signup';

function Meetups() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [data, setData] = useState([]);

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);

    const [selectedDates, setSelectedDates] = useState(new Date().setDate(new Date().getDate()));
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');
    const [recurency, setRecurency] = useState('Unique');
    const [loading, setLoading] = useState(false);

    const currentUser = auth.currentUser;
    const user = useAtomValue(userType);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getDocs(query(collection(db, 'happyhours'), orderBy('date', 'asc')));
            setData(res.docs.map((doc) => doc.data()));
        };
        fetchData();
    }, []);

    const handleUpload = (e) => {
        e.preventDefault();
        setFileLoading(true);
        const file = e.target[0]?.files[0];
        if (!file) return;
        const storageRef = ref(storage, `happyhours/${uuidv4()}`);
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

    const handleCreate = async () => {
        setLoading(true);
        const toAdd = {
            uid: uuidv4(),
            name,
            description,
            details,
            recurency,
            imageUrl: imgUrl,
            userId: currentUser.uid,
            date: new Date(selectedDates).toString(),
        };
        try {
            await addDoc(collection(db, 'happyhours'), {
                ...toAdd,
            });
            await addDoc(collection(db, `happyhours/${uid}/participants`), {
                ...user
            })
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

        setData([...data, toAdd]);
        setLoading(false);
        setCreateModalOpen(false);
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
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                        {/* Page header */}
                        <div className='sm:flex sm:justify-between sm:items-center mb-5'>
                            {/* Left: Title */}
                            <div className='mb-4 sm:mb-0'>
                                <h1 className='text-2xl md:text-3xl text-slate-800 font-bold'>Happy Hours ✨</h1>
                            </div>

                            {/* Right: Actions */}
                            <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
                                {/* Search form */}
                                <SearchForm placeholder='Search…' />

                                {/* Add meetup button */}
                                {user.type === 'business' && (
                                    <button
                                        className='btn bg-indigo-500 hover:bg-indigo-600 text-white'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCreateModalOpen(true);
                                        }}
                                    >
                                        <svg className='w-4 h-4 fill-current opacity-50 shrink-0' viewBox='0 0 16 16'>
                                            <path d='M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z' />
                                        </svg>
                                        <span className='hidden xs:block ml-2'>Happy Hour</span>
                                    </button>
                                )}

                                <ModalBasic
                                    id='basic-modal'
                                    modalOpen={createModalOpen}
                                    setModalOpen={setCreateModalOpen}
                                    title='Create your Happy Hour'
                                >
                                    {/* Modal content */}
                                    <div className='px-5 pt-4 pb-1 space-y-4'>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Date
                                            </label>
                                            <Datepicker selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
                                        </div>
                                        <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                                    Recurence <span className='text-rose-500'>*</span>
                                                </label>
                                                <select
                                                    id='country'
                                                    className='form-select w-full'
                                                    value={recurency}
                                                    onChange={(e) => setRecurency(e.target.value)}
                                                >
                                                    <option value='Unique'>Unique</option>
                                                    <option value='Daily'>Tout les jours</option>
                                                    <option value='Weekly'>Toute les semaines</option>
                                                    <option value='Monthly'>Tout les mois</option>
                                                </select>
                                            </div>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Nom
                                            </label>
                                            <input
                                                id='placeholder'
                                                className='form-input w-full'
                                                type='text'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder='Add the name of your Happy Hour'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Description
                                            </label>
                                            <input
                                                id='placeholder'
                                                className='form-input w-full'
                                                type='text'
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder='Add a short description'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Details
                                            </label>
                                            <textarea
                                                id='placeholder'
                                                className='form-input w-full'
                                                type='text'
                                                rows={5}
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                placeholder='Add as much details as possible'
                                            />
                                        </div>
                                        {!imgUrl && (
                                            <form onSubmit={handleUpload} className='flex flex-row justify-between items-center'>
                                                <input
                                                    className='block border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 file:bg-transparent file:border-0 file:bg-gray-100 file:mr-4 file:py-3 file:px-4'
                                                    type='file'
                                                />
                                                <button className='btn py-3 bg-indigo-500 hover:bg-indigo-600 text-white' type='submit'>
                                                    {fileLoading ? 'Chargement en cours...' : 'Télécharger'}
                                                </button>
                                            </form>
                                        )}

                                        {imgUrl && <img src={imgUrl} alt='uploaded file' height={200} />}
                                    </div>
                                    {/* Modal footer */}
                                    <div className='px-5 py-4'>
                                        <div className='flex flex-wrap justify-end space-x-2'>
                                            <button
                                                className='btn-sm border-slate-200 hover:border-slate-300 text-slate-600'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCreateModalOpen(false);
                                                }}
                                            >
                                                Fermer
                                            </button>
                                            <button
                                                className='btn-sm bg-indigo-500 hover:bg-indigo-600 text-white'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreate();
                                                }}
                                            >
                                                {loading ? 'Chargement en cours...' : 'Créer'}
                                            </button>
                                        </div>
                                    </div>
                                </ModalBasic>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className='mb-5'>
                            <ul className='flex flex-wrap -m-1'>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out'>
                                        Voir tout
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        En ligne
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Locale
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Cette semaine
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Ce mois
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Following
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className='text-sm text-slate-500 italic mb-4'>289 Happy Hours</div>

                        {/* Content */}
                        <MeetupsPosts data={data} />

                        {/* Pagination */}
                        <div className='mt-8'>
                            <PaginationNumeric />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Meetups;
