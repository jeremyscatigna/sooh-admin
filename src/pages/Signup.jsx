import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthImage from '../images/auth-image.jpg';
import AuthDecoration from '../images/auth-decoration.png';
import { useUserAuth } from '../context/UserAuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../main';
import { atom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const userIdAtom = atom(undefined);
export const currentUserDocumentIdAtom = atom(undefined);
export const userNameAtom = atom(undefined);
export const currentUser = atomWithStorage('currentUser', {
    type: 'business',
});

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const setUserId = useSetAtom(userIdAtom);
    const setCurrentUserDocumentId = useSetAtom(currentUserDocumentIdAtom);
    const setUserName = useSetAtom(userNameAtom);
    const setCurrentUser = useSetAtom(currentUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            setUserId(user.uid);
            setUserName(firstName);

            try {
                const document = await addDoc(collection(db, 'users'), {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email,
                    avatar: '',
                    type: '',
                    details: '',
                    description: '',
                });

                setCurrentUser({
                    uid: user.uid,
                    firstName,
                    lastName,
                    email,
                    avatar: '',
                    type: '',
                    details: '',
                    description: '',
                });
                setCurrentUserDocumentId(document.id);

                navigate('/onboarding-01');
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            console.log(error);
        }
    };

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
                            <h1 className='text-3xl text-primary font-bold mb-6'>Créez votre compte</h1>
                            {/* Form */}
                            <form>
                                <div className='space-y-4'>
                                    <div>
                                        <input
                                            id='email'
                                            className='form-input bg-hover rounded-full border-none text-secondary placeholder-secondary w-full'
                                            type='email'
                                            placeholder='Adresse e-mail'
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id='name'
                                            className='form-input bg-hover rounded-full border-none text-secondary placeholder-secondary w-full'
                                            type='text'
                                            placeholder='Prénom'
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id='name'
                                            className='form-input bg-hover rounded-full border-none text-secondary placeholder-secondary w-full'
                                            type='text'
                                            placeholder='Nom'
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    {/* <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="role">Your Role <span className="text-rose-500">*</span></label>
                    <select id="role" className="form-select w-full" onChange={(e) => setRole(e.target.value)}>
                      <option>Designer</option>
                      <option>Developer</option>
                    </select>
                  </div> */}
                                    <div>
                                        <input
                                            id='password'
                                            className='form-input bg-hover rounded-full border-none text-secondary placeholder-secondary w-full'
                                            type='password'
                                            placeholder='Mot de passe'
                                            autoComplete='on'
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mt-6'>
                                    <button
                                        className='btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white whitespace-nowrap'
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        {loading ? 'Chargement en cours...' : "S'inscrire"}
                                    </button>
                                </div>
                            </form>
                            {/* Footer */}
                            <div className='pt-5 mt-6 border-t border-slate-200'>
                                <div className='text-sm'>
                                    Vous avez un compte ?{' '}
                                    <Link className='font-medium text-pink-500 hover:text-secondary' to='/signin'>
                                        Se connecter
                                    </Link>
                                </div>
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

export default Signup;
