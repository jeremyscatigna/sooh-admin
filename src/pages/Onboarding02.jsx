import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import OnboardingImage from '../images/onboarding-image.jpg';
import OnboardingDecoration from '../images/auth-decoration.png';
import { useAtomValue } from 'jotai';
import { currentUserDocumentIdAtom, userIdAtom } from './Signup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../main';
import { userTypeAtom } from './Onboarding01';

function Onboarding02() {
    const [companyName, setCompanyName] = React.useState('');
    const [city, setCity] = React.useState('');
    const [postalCode, setPostalCode] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [instagram, setInstagram] = React.useState('');
    const [tiktok, setTiktok] = React.useState('');
    const [youtube, setYoutube] = React.useState('');

    const navigate = useNavigate();
    const userId = useAtomValue(userIdAtom);

    const userType = useAtomValue(userTypeAtom);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(userType === 'influencer') {
            try {
                await addDoc(collection(db, `users/${userId}/influencer`), {
                    instagram,
                    tiktok,
                    youtube,
                });

                navigate('/onboarding-04');
            } catch (err) {
                console.log(err);
            }
        }
        if(userType === 'business') {
            try {
                await addDoc(collection(db, `users/${userId}/company`), {
                    companyName,
                    city,
                    postalCode,
                    street,
                    country,
                });

                navigate('/onboarding-04');
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <main className='bg-white'>
            <div className='relative flex'>
                {/* Content */}
                <div className='w-full md:w-1/2'>
                    <div className='min-h-[100dvh] h-full flex flex-col after:flex-1'>
                        <div className='flex-1'>
                            {/* Header */}
                            <div className='flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8'>
                                {/* Logo */}
                                <Link className='block' to='/'>
                                    <svg width='32' height='32' viewBox='0 0 32 32'>
                                        <defs>
                                            <linearGradient x1='28.538%' y1='20.229%' x2='100%' y2='108.156%' id='logo-a'>
                                                <stop stopColor='#A5B4FC' stopOpacity='0' offset='0%' />
                                                <stop stopColor='#A5B4FC' offset='100%' />
                                            </linearGradient>
                                            <linearGradient x1='88.638%' y1='29.267%' x2='22.42%' y2='100%' id='logo-b'>
                                                <stop stopColor='#38BDF8' stopOpacity='0' offset='0%' />
                                                <stop stopColor='#38BDF8' offset='100%' />
                                            </linearGradient>
                                        </defs>
                                        <rect fill='#6366F1' width='32' height='32' rx='16' />
                                        <path
                                            d='M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z'
                                            fill='#4F46E5'
                                        />
                                        <path
                                            d='M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z'
                                            fill='url(#logo-a)'
                                        />
                                        <path
                                            d='M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z'
                                            fill='url(#logo-b)'
                                        />
                                    </svg>
                                </Link>
                                <div className='text-sm'>
                                    Have an account?{' '}
                                    <Link className='font-medium text-indigo-500 hover:text-indigo-600' to='/signin'>
                                        Sign In
                                    </Link>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className='px-4 pt-12 pb-8'>
                                <div className='max-w-md mx-auto w-full'>
                                    <div className='relative'>
                                        <div className='absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200' aria-hidden='true'></div>
                                        <ul className='relative flex justify-between w-full'>
                                            <li>
                                                <Link
                                                    className='flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white'
                                                    to='/onboarding-01'
                                                >
                                                    1
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className='flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white'
                                                    to='/onboarding-02'
                                                >
                                                    2
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className='flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-100 text-slate-500'
                                                    to='/onboarding-03'
                                                >
                                                    3
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className='flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-100 text-slate-500'
                                                    to='/onboarding-04'
                                                >
                                                    4
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {userType === 'business' && (
                            <div className='px-4 py-8'>
                                <div className='max-w-md mx-auto'>
                                    <h1 className='text-3xl text-slate-800 font-bold mb-6'>Company information ✨</h1>
                                    {/* htmlForm */}
                                    <form>
                                        <div className='space-y-4 mb-8'>
                                            {/* Company Name */}
                                            <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='company-name'>
                                                    Company Name <span className='text-rose-500'>*</span>
                                                </label>
                                                <input
                                                    id='company-name'
                                                    className='form-input w-full'
                                                    type='text'
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                />
                                            </div>
                                            {/* City and Postal Code */}
                                            <div className='flex space-x-4'>
                                                <div className='flex-1'>
                                                    <label className='block text-sm font-medium mb-1' htmlFor='city'>
                                                        City <span className='text-rose-500'>*</span>
                                                    </label>
                                                    <input
                                                        id='city'
                                                        className='form-input w-full'
                                                        type='text'
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <label className='block text-sm font-medium mb-1' htmlFor='postal-code'>
                                                        Postal Code <span className='text-rose-500'>*</span>
                                                    </label>
                                                    <input
                                                        id='postal-code'
                                                        className='form-input w-full'
                                                        type='text'
                                                        value={postalCode}
                                                        onChange={(e) => setPostalCode(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {/* Street Address */}
                                            <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='street'>
                                                    Street Address <span className='text-rose-500'>*</span>
                                                </label>
                                                <input
                                                    id='street'
                                                    className='form-input w-full'
                                                    type='text'
                                                    value={street}
                                                    onChange={(e) => setStreet(e.target.value)}
                                                />
                                            </div>
                                            {/* Country */}
                                            <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='country'>
                                                    Country <span className='text-rose-500'>*</span>
                                                </label>
                                                <select
                                                    id='country'
                                                    className='form-select w-full'
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                >
                                                    <option>USA</option>
                                                    <option>Italy</option>
                                                    <option>United Kingdom</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <Link className='text-sm underline hover:no-underline' to='/onboarding-01'>
                                                &lt;- Back
                                            </Link>
                                            <button
                                                className='btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto'
                                                onClick={(e) => handleSubmit(e)}
                                            >
                                                Next Step -&gt;
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {userType === 'influencer' && (
                            <div className='px-4 py-8'>
                                <div className='max-w-md mx-auto'>
                                    <h1 className='text-3xl text-slate-800 font-bold mb-6'>Your links ✨</h1>
                                    {/* htmlForm */}
                                    <form>
                                        <div className='space-y-4 mb-8'>
                                            {/* Company Name */}
                                            <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='company-name'>
                                                    Instagram <span className='text-rose-500'>*</span>
                                                </label>
                                                <input
                                                    id='company-name'
                                                    className='form-input w-full'
                                                    type='text'
                                                    value={instagram}
                                                    onChange={(e) => setInstagram(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='company-name'>
                                                    Tiktok <span className='text-rose-500'>*</span>
                                                </label>
                                                <input
                                                    id='company-name'
                                                    className='form-input w-full'
                                                    type='text'
                                                    value={tiktok}
                                                    onChange={(e) => setTiktok(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className='block text-sm font-medium mb-1' htmlFor='company-name'>
                                                    Youtube <span className='text-rose-500'>*</span>
                                                </label>
                                                <input
                                                    id='company-name'
                                                    className='form-input w-full'
                                                    type='text'
                                                    value={youtube}
                                                    onChange={(e) => setYoutube(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <Link className='text-sm underline hover:no-underline' to='/onboarding-01'>
                                                &lt;- Back
                                            </Link>
                                            <button
                                                className='btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto'
                                                onClick={(e) => handleSubmit(e)}
                                            >
                                                Next Step -&gt;
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image */}
                <div className='hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2' aria-hidden='true'>
                    <img
                        className='object-cover object-center w-full h-full'
                        src={OnboardingImage}
                        width='760'
                        height='1024'
                        alt='Onboarding'
                    />
                    <img
                        className='absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block'
                        src={OnboardingDecoration}
                        width='218'
                        height='224'
                        alt='Authentication decoration'
                    />
                </div>
            </div>
        </main>
    );
}

export default Onboarding02;
