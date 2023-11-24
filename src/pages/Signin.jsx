import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthImage from '../images/auth-image.jpg';
import AuthDecoration from '../images/auth-decoration.png';
import { useUserAuth } from '../context/UserAuthContext';
import { userTypeAtom } from './Onboarding01';
import { currentUser, currentUserDocumentIdAtom, userIdAtom, userNameAtom } from './Signup';
import { useSetAtom } from 'jotai';
import { auth, db } from '../main';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { EyeAlt, EyeClose } from 'iconoir-react';

function Signin() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const navigate = useNavigate();
    const { logIn } = useUserAuth();

    const setUserId = useSetAtom(userIdAtom);
    const setUserName = useSetAtom(userNameAtom);
    const setUserType = useSetAtom(userTypeAtom);
    const setCurrentUser = useSetAtom(currentUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            const user = res.user;

            setUserId(user.uid);
            const q = query(collection(db, 'users'), where('uid', '==', user.uid));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setCurrentUser(doc.data());
                setUserType(doc.data().type);
                setUserName(doc.data().name);
                setLoading(false);
                navigate('/');
            });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const isDisabled = !email || !password;

    return (
        <main className='bg-background'>
            <div className='relative md:flex'>
                {/* Content */}
                <div className='md:w-1/2'>
                    <div className='min-h-[100dvh] h-full flex flex-col after:flex-1'>
                        {/* Header */}
                        <div className='flex-1'>
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
                            </div>
                        </div>

                        <div className='max-w-sm mx-auto w-full px-4 py-8'>
                            <h1 className='text-3xl text-primary font-bold mb-6'>Content de te revoir!</h1>
                            {/* Form */}
                            <form>
                                <div className='space-y-4'>
                                    <div>
                                        <input
                                            id='email'
                                            className='form-input rounded-full border-none bg-hover placeholder-secondary text-secondary w-full'
                                            type='email'
                                            placeholder='Adresse e-mail'
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor='email' className='relative text-gray-400 focus-within:text-gray-600 block'>
                                            {isPasswordVisible ? (
                                                <EyeAlt
                                                    onClick={() => setIsPasswordVisible(false)}
                                                    className='w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-4'
                                                />
                                            ) : (
                                                <EyeClose
                                                    onClick={() => setIsPasswordVisible(true)}
                                                    className='w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-4'
                                                />
                                            )}

                                            <input
                                                id='password'
                                                className='form-input rounded-full border-none bg-hover placeholder-secondary text-secondary w-full'
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                placeholder='Mot de passe'
                                                autoComplete='on'
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mt-6'>
                                    <div className='mr-1'>
                                        <Link className='text-sm underline hover:no-underline' to='/reset-password'>
                                            Mot de passe oublié?
                                        </Link>
                                    </div>
                                    <button
                                        disabled={isDisabled}
                                        className={`btn ${
                                            isDisabled
                                                ? 'bg-card text-secondary'
                                                : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                                        } rounded-full whitespace-nowrap ml-3`}
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        {loading ? 'Chargement en cours...' : 'Se connecter'}
                                    </button>
                                </div>
                            </form>
                            {/* Footer */}
                            <div className='pt-5 mt-6 border-t border-slate-200'>
                                <div className='text-sm'>
                                    Vous n'avez pas de compte ?{' '}
                                    <Link className='font-medium text-pink-500 hover:text-secondary' to='/signup'>
                                        S'inscrire
                                    </Link>
                                </div>
                                {/* Warning */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className='hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2' aria-hidden='true'>
                    <img
                        className='object-cover object-center w-full h-full'
                        src={AuthImage}
                        width='760'
                        height='1024'
                        alt='Authentication'
                    />
                    <img
                        className='absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block'
                        src={AuthDecoration}
                        width='218'
                        height='224'
                        alt='Authentication decoration'
                    />
                </div>
            </div>
        </main>
    );
}

export default Signin;
