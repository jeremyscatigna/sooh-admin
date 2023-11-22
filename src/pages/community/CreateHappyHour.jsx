import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../main';
import { useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Datepicker from '../../components/Datepicker';
import dayjs from 'dayjs';
import Avvvatars from 'avvvatars-react';
import { Cancel, Check, Edit } from 'iconoir-react';
import { categories } from '../../utils/categories';

const getLocaleDateTime = () => {
    let d = new Date();
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    return dateTimeLocalValue;
};

function CreateHappyHour() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const connectedUser = useAtomValue(currentUser);
    const [data, setData] = useState([]);

    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [fileLoading, setFileLoading] = useState(false);

    const [selectedDates, setSelectedDates] = useState(() => getLocaleDateTime());
    const [endDate, setEndDate] = useState(() => getLocaleDateTime());
    const [name, setName] = useState('');
    const [validateName, setValidateName] = useState(false);
    const [description, setDescription] = useState('');
    const [validateDescription, setValidateDescription] = useState(false);
    const [details, setDetails] = useState('');
    const [validateDetails, setValidateDetails] = useState(false);
    const [recurency, setRecurency] = useState('Unique');
    const [category, setCategory] = useState('Autres');
    const [type, setType] = useState('online');
    const [addEndDate, setAddEndDate] = useState(false);
    const [deal, setDeal] = useState('20%');
    const [location, setLocation] = useState('');
    const [validateLocation, setValidateLocation] = useState(false);
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
            location,
            details,
            recurency,
            type,
            deal,
            favorites: [],
            likes: [],
            imageUrl: imgUrl,
            userId: connectedUser.uid,
            category,
            date: selectedDates,
            endDate: addEndDate ? endDate : null,
        };

        console.log(toAdd);
        try {
            await addDoc(collection(db, 'happyhours'), {
                ...toAdd,
            });
            await addDoc(collection(db, `happyhours/${toAdd.uid}/participants`), {
                ...connectedUser,
            });

            setLoading(false);
            navigate(`/happyhours/${toAdd.uid}}`);
        } catch (e) {
            console.log(e);
            setLoading(false);

            navigate('/happyhours');
        }
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className={`relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden`}>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <div className={`px-4 sm:px-6 lg:px-8 py-8 w-full ${mobile && 'mb-32'}`}>
                        {/* Page content */}
                        <div className='w-full mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16'>
                            {/* Content */}
                            <div className='w-full'>
                                <div className='mb-6'>
                                    <Link
                                        className='btn-sm rounded-full px-3 bg-hover hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary'
                                        to='/happyhours'
                                    >
                                        <svg className='fill-current text-primary mr-2' width='7' height='12' viewBox='0 0 7 12'>
                                            <path d='M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z' />
                                        </svg>
                                        <span>Retours</span>
                                    </Link>
                                </div>
                                <div
                                    className={`text-sm font-sm mb-2 flex ${
                                        mobile ? 'flex-col justify-center space-y-2' : 'flex-row items-center space-x-2'
                                    }`}
                                >
                                    <Datepicker align='left' selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
                                    <div className='text-sm font-sm'>
                                        <input
                                            onClick={() => setAddEndDate(!addEndDate)}
                                            value={addEndDate}
                                            type='checkbox'
                                            className='mr-2 rounded bg-hover border-none focus:ring-pink-500 text-pink-500'
                                        />
                                        <label className='text-sm font-sm mb-1'>Ajouter une date de fin</label>
                                    </div>
                                    {addEndDate && <Datepicker align='left' selectedDates={endDate} setSelectedDates={setEndDate} />}
                                </div>
                                <header className='mb-4'>
                                    {/* Title */}
                                    {validateName ? (
                                        <div className='flex flex-row space-x-2'>
                                            <h1 className='text-2xl md:text-3xl text-primary font-bold mb-2'>{name}</h1>
                                            <button
                                                onClick={() => {
                                                    setValidateName(false);
                                                }}
                                            >
                                                <Edit />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='mt-4'>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Titre
                                            </label>
                                            <div className='flex flex-row space-x-2'>
                                                <input
                                                    id='placeholder'
                                                    className='form-input rounded-xl border-none bg-hover text-secondary w-full'
                                                    type='text'
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder='Ce qui apparaîtra sur la vignettes visible par les utilisateurs'
                                                />

                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setValidateName(true);
                                                        }}
                                                    >
                                                        <Check />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setName('');
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </button>
                                                </>
                                            </div>
                                        </div>
                                    )}

                                    {validateDescription ? (
                                        <div className='flex flex-row space-x-2'>
                                            <p>{description}</p>
                                            <button onClick={() => setValidateDescription(false)}>
                                                <Edit />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='mt-4'>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Description
                                            </label>
                                            <div className='flex flex-row space-x-2'>
                                                <input
                                                    id='placeholder'
                                                    className='form-input rounded-xl border-none bg-hover text-secondary w-full'
                                                    type='text'
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder='Une description courte pour donner envie a vos clients'
                                                />

                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setValidateDescription(true);
                                                        }}
                                                    >
                                                        <Check />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDescription('');
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </button>
                                                </>
                                            </div>
                                        </div>
                                    )}

                                    {validateLocation ? (
                                        <div className='flex flex-row space-x-2'>
                                            {type === 'online' ? <a href={location}>{location}</a> : <p>{location}</p>}
                                            <button onClick={() => setValidateLocation(false)}>
                                                <Edit />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='mt-4'>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Localisation
                                            </label>
                                            <div className='flex flex-row space-x-2'>
                                                <input
                                                    id='placeholder'
                                                    className='form-input rounded-xl border-none bg-hover text-secondary w-full'
                                                    type='text'
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder={type === "online" ? "Ajouter le site web ou aura lieu votre Happy Hour" : "Ajoutez l'adresses de la boutique"}
                                                />

                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setValidateLocation(true);
                                                        }}
                                                    >
                                                        <Check />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setLocation('');
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </button>
                                                </>
                                            </div>
                                        </div>
                                    )}
                                </header>

                                <div className='mt-4'>
                                    <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                        Recurence <span className='text-rose-500'>*</span>
                                    </label>
                                    <select
                                        id='country'
                                        className='form-select rounded-xl border-none bg-hover text-secondary w-full'
                                        value={recurency}
                                        onChange={(e) => setRecurency(e.target.value)}
                                    >
                                        <option value='Unique'>Unique</option>
                                        <option value='Daily'>Tout les jours</option>
                                        <option value='Weekly'>Toute les semaines</option>
                                        <option value='Monthly'>Tout les mois</option>
                                    </select>
                                </div>

                                <div className='mt-4'>
                                    <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                        Type <span className='text-rose-500'>*</span>
                                    </label>
                                    <select
                                        id='country'
                                        className='form-select rounded-xl border-none bg-hover text-secondary w-full'
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value='online'>En ligne</option>
                                        <option value='instore'>En boutique</option>
                                    </select>
                                </div>

                                <div className='mt-4'>
                                    <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                        Montant de la remise <span className='text-rose-500'>*</span>
                                    </label>
                                    <select
                                        id='country'
                                        className='form-select rounded-xl border-none bg-hover text-secondary w-full'
                                        value={deal}
                                        onChange={(e) => setDeal(e.target.value)}
                                    >
                                        <option value='20%'>20%</option>
                                        <option value='30%'>30%</option>
                                        <option value='40%'>40%</option>
                                        <option value='50%'>50%</option>
                                        <option value='60%'>60%</option>
                                        <option value='70%'>70%</option>
                                        <option value='80%'>80%</option>
                                    </select>
                                </div>

                                <div className='mt-4'>
                                    <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                        Categorie <span className='text-rose-500'>*</span>
                                    </label>
                                    <select
                                        id='country'
                                        className='form-select rounded-xl border-none bg-hover text-secondary w-full'
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Meta */}
                                <div className='space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 mb-6 mt-4'>
                                    {/* Author */}
                                    <div className='flex items-center sm:mr-4'>
                                        <a className='block mr-2 shrink-0' href='#0'>
                                            <Avvvatars value={`${connectedUser.firstName} ${connectedUser.lastName}`} />
                                        </a>
                                        <div className='text-sm whitespace-nowrap'>
                                            Hébergé par{' '}
                                            <a className='font-semibold text-pink-500' href='#0'>
                                                {connectedUser.firstName} {connectedUser.lastName}
                                            </a>
                                        </div>
                                    </div>
                                    {/* Right side */}
                                </div>

                                {/* Image */}
                                <figure className='mb-6'>
                                    {imgUrl ? (
                                        <img className='w-full rounded-sm' src={imgUrl} width='640' height='360' alt='Meetup' />
                                    ) : (
                                        <form onSubmit={handleUpload} className='flex flex-row justify-between items-center'>
                                            <input
                                                className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100'
                                                type='file'
                                            />
                                            <button
                                                className='btn py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white'
                                                type='submit'
                                            >
                                                {fileLoading ? 'Chargement...' : 'Télécharger'}
                                            </button>
                                        </form>
                                    )}
                                </figure>

                                {/* Post content */}
                                <div>
                                    <h2 className='text-xl leading-snug text-primary font-bold mb-2'>Détails</h2>
                                    {validateDetails ? (
                                        <div className='flex flex-row space-x-2'>
                                            <p className='mb-6'>{details}</p>
                                            <button onClick={() => setValidateDetails(false)}>
                                                <Edit />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='flex flex-row space-x-2'>
                                                <textarea
                                                    id='placeholder'
                                                    className='form-input rounded-xl border-none bg-hover text-secondary w-full'
                                                    type='text'
                                                    rows={5}
                                                    value={details}
                                                    onChange={(e) => setDetails(e.target.value)}
                                                    placeholder='Ajoutez autant de détails que possible pour attirer vos clients'
                                                />
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setValidateDetails(true);
                                                        }}
                                                    >
                                                        <Check />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDetails('');
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </button>
                                                </>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    className='btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white mt-4'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCreate();
                                    }}
                                >
                                    <Check className='mr-2' />
                                    {loading ? 'Chargement...' : 'Créer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CreateHappyHour;
