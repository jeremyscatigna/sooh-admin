import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthImage from '../images/auth-image.jpg';
import logo from '../images/logo-nobg.png';
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
    // const setCurrentUser = useSetAtom(currentUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log(res)
            const user = res.user;

            setUserId(user.uid);
            const q = query(collection(db, 'users'), where('uid', '==', user.uid));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // setCurrentUser(doc.data());
                localStorage.setItem("user", JSON.stringify(doc.data()));
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
                            <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8'>{/* Logo */}</div>
                        </div>

                        <div className='max-w-sm mx-auto w-full px-4 py-8'>
                            <div className='w-full justify-center items-center'>
                                <Link className='w-full flex items-center justify-center' to='/'>
                                    <img className='h-24 w-auto' src={logo} alt='Logo' />
                                </Link>
                                <h1 className='text-3xl text-primary font-bold mb-2 text-center'>Connectez</h1>
                                <h1 className='text-3xl text-primary font-bold mb-2 text-center'>Boostez</h1>
                                <h1 className='text-3xl text-primary font-bold mb-6 text-center'>Vivez</h1>
                            </div>
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
