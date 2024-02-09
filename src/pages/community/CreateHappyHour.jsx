import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import MeetupImage from '../../images/meetup-image.jpg';

import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../main';
import { useAtomValue } from 'jotai';
import { currentUser } from '../Signup';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Datepicker from '../../components/Datepicker';
import Avvvatars from 'avvvatars-react';
import { Cancel, Check, Edit, EyeAlt, MapsArrowDiagonal, Safari } from 'iconoir-react';
import { categories } from '../../utils/categories';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import dayjs from 'dayjs';

const getLocaleDateTime = () => {
    let d = new Date();
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    return dateTimeLocalValue;
};

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function CreateHappyHour() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const connectedUser = useAtomValue(currentUser);

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
    const [endTime, setEndTime] = useState('');
    const [city, setCity] = useState('');
    const [closedDays, setClosedDays] = useState([]);
    const [loading, setLoading] = useState(false);

    const [previsualisation, setPrevisualisation] = useState(false);

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
        if (name === '' || description === '' || location === '' || endTime === '' || imgUrl === '') {
            alert('Veuillez remplir tous les champs');
            setLoading(false);
            return;
        }
        const toAdd = {
            uid: uuidv4(),
            name,
            description,
            location: location + ' ' + city,
            city,
            details,
            recurency,
            type,
            deal,
            closedDays,
            favorites: [],
            likes: [],
            imageUrl: imgUrl,
            userId: connectedUser.uid,
            category,
            date: selectedDates,
            endDate: addEndDate ? endDate : null,
            endTime,
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
            navigate(`/happyhours`);
        } catch (e) {
            console.log(e);
            setLoading(false);

            navigate('/happyhours');
        }
    };

    const getHoursFromDateTime = (date) => {
        return dayjs(date).format('HH:mm');
    };

    const getDayFromDateTime = (date) => {
        return dayjs(date).format('dddd');
    };

    const displayDateOrRecurency = () => {
        if (recurency === 'Daily') {
            if (endTime) {
                return 'Tous les jours de ' + getHoursFromDateTime(selectedDates) + ' a ' + endTime;
            }
            return 'Tous les jours a ' + getHoursFromDateTime(selectedDates);
        }

        if (recurency === 'Weekly') {
            if (endTime) {
                return 'Tous les ' + getDayFromDateTime(selectedDates) + ' de ' + getHoursFromDateTime(selectedDates) + ' a ' + endTime;
            }
            return 'Tous les ' + getDayFromDateTime(selectedDates) + ' a ' + getHoursFromDateTime(selectedDates);
        }

        return dayjs(selectedDates).format('LLL');
    };

    const removeFirstPartOfUrl = (url) => {
        if (url) {
            return url.replace('https://', '');
        }

        return url;
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

                                {previsualisation === false ? (
                                    <>
                                        <div
                                            className={`text-sm font-sm mb-2 flex ${
                                                mobile ? 'flex-col justify-center space-y-2' : 'flex-row items-center space-x-2'
                                            }`}
                                        >
                                            <Datepicker align='left' selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
                                        </div>
                                        <div className='flex flex-col pt-2 pb-4'>
                                            <label className='text-sm font-medium mb-2 ml-1'>Ajouter une heure de fin</label>
                                            <input
                                                type='time'
                                                id='meeting-time'
                                                name='meeting-time'
                                                className='form-input rounded-xl border-none bg-hover text-secondary font-medium w-60'
                                                value={endTime}
                                                min={getHoursFromDateTime(selectedDates)}
                                                onChange={(e) => {
                                                    if (e.target.value < getHoursFromDateTime(selectedDates)) {
                                                        alert("L'heure de fin doit être supérieur à l'heure de début");
                                                        return;
                                                    }
                                                    setEndTime(e.target.value);
                                                }}
                                            />
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
                                                        Nom du commerce
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
                                                    <option value='instore'>Sur place</option>
                                                    <option value='home'>A domicile</option>
                                                </select>
                                            </div>

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
                                                            placeholder={
                                                                type === 'online'
                                                                    ? 'https://example.com'
                                                                    : "Ajoutez l'adresses"
                                                            }
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

                                            {type !== 'online' && (
                                                <div className='mt-4'>
                                                    <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                        Ville
                                                    </label>
                                                    <div className='flex flex-row space-x-2'>
                                                        <input
                                                            id='placeholder'
                                                            className='form-input rounded-xl border-none bg-hover text-secondary w-full'
                                                            type='text'
                                                            value={city}
                                                            onChange={(e) => setCity(e.target.value)}
                                                            placeholder={'Ajoutez la ville de la boutique'}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </header>

                                        <div className='mt-4'>
                                            <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                                Recurrence <span className='text-rose-500'>*</span>
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

                                        <div className='mt-6 pb-4'>
                                            <MultiSelectDropdown
                                                formFieldName='Jours de fermeture'
                                                options={days}
                                                onChange={setClosedDays}
                                                prompt='Jours de fermeture'
                                            />
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
                                                        {connectedUser.username && connectedUser.username !== ''
                                                            ? connectedUser.username
                                                            : connectedUser.firstName + ' ' + connectedUser.lastName}
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
                                    </>
                                ) : (
                                    <>
                                        <div className='text-sm font-semibold text-pink-500 uppercase mb-2'>{displayDateOrRecurency()}</div>
                                        <header className='mb-4'>
                                            {/* Title */}
                                            <div className='flex flex-wrap items-center mb-2'>
                                                <h1 className='text-2xl md:text-3xl text-primary font-bold'>{name}</h1>
                                                {deal && (
                                                    <span className='text-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded-full px-3 py-1 ml-2'>
                                                        -{deal}
                                                    </span>
                                                )}
                                            </div>
                                            <p>{description}</p>

                                            <p className='text-secondary text-xs flex row mt-1'>
                                                {type === 'instore' ? (
                                                    <>
                                                        <MapsArrowDiagonal className='h-4 w-4 mr-1' />
                                                        <a
                                                            href={`http://maps.google.com/?q=${location}`}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                        >
                                                            {location}
                                                        </a>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Safari className='h-4 w-4 mr-1' />
                                                        <a href={location} target='_blank' rel='noopener noreferrer'>
                                                            {removeFirstPartOfUrl(location)}
                                                        </a>
                                                    </>
                                                )}
                                            </p>
                                            <p className='text-secondary text-xs flex row mt-1'>
                                                {closedDays && (
                                                    <>
                                                        <span className='mr-1'>Fermé le(s) </span>
                                                        {closedDays.map((day) => (
                                                            <span key={day} className='mr-1'>
                                                                {day}
                                                            </span>
                                                        ))}
                                                    </>
                                                )}
                                            </p>
                                        </header>

                                        {/* Meta */}
                                        <div className='space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 mb-6'></div>

                                        {/* Image */}
                                        <figure className='mb-6'>
                                            <img
                                                className='w-full rounded-sm'
                                                src={imgUrl || MeetupImage}
                                                width='640'
                                                height='360'
                                                alt='Meetup'
                                            />
                                        </figure>

                                        {/* Post content */}
                                        <div>
                                            <h2 className='text-xl leading-snug text-primary font-bold mb-2'>Détails</h2>
                                            <p className='mb-6'>{details}</p>
                                        </div>
                                    </>
                                )}

                                <div className='space-x-4'>
                                    <button
                                        className='btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white mt-4'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPrevisualisation(!previsualisation);
                                        }}
                                    >
                                        <EyeAlt className='mr-2' />
                                        {previsualisation === true ? 'Modifier' : 'Previsualiser'}
                                    </button>
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
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CreateHappyHour;
