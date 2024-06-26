import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthImage from '../images/auth-image.jpg';
import logo from '../images/logo-nobg.png';
import AuthDecoration from '../images/auth-decoration.png';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../main';
import { atom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { EyeAlt, EyeClose } from 'iconoir-react';

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
    const [username, setUsername] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const setUserId = useSetAtom(userIdAtom);
    const setCurrentUserDocumentId = useSetAtom(currentUserDocumentIdAtom);
    const setUserName = useSetAtom(userNameAtom);
    const setCurrentUser = useSetAtom(currentUser);

    const signUpErrorHandling = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                setError('Un compte existe déjà avec cette adresse e-mail.');
                break;
            case 'auth/invalid-email':
                setError('Adresse e-mail invalide.');
                break;
            case 'auth/weak-password':
                setError('Le mot de passe est trop faible.');
                break;
            default:
                setError("Une erreur s'est produite. Veuillez réessayer.");
                break;
        }
    };

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
                    username,
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
                    username,
                    avatar: '',
                    type: '',
                    details: '',
                    description: '',
                });
                // localStorage.setItem("user", JSON.stringify({
                //     uid: user.uid,
                //     firstName,
                //     lastName,
                //     email,
                //     username,
                //     avatar: '',
                //     type: '',
                //     details: '',
                //     description: '',
                // }));
                // localStorage.setItem("currentUserDocumentId", document.id);
                setCurrentUserDocumentId(document.id);

                navigate('/onboarding-01');
            } catch (err) {
                console.log(err);
                signUpErrorHandling(err);
                setLoading(false);
            }
            setLoading(false);
        } catch (err) {
            signUpErrorHandling(err);
            console.log(error);
        }
    };

    const isDisabled = !email || (!password && password.length < 6) || !firstName || !lastName;

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
                                    <img className='h-12 w-auto' src={logo} alt='Logo' />
                                </Link>
                            </div>
                        </div>

                        <div className='max-w-sm mx-auto w-full px-4 py-8'>
                            <h1 className='text-3xl text-primary font-bold'>Créez votre compte</h1>
                            <p className='text-xs text-pink-500 mb-6'>Tous les champs sont obligatoire</p>
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
                                    <div>
                                        <input
                                            id='username'
                                            className='form-input bg-hover rounded-full border-none text-secondary placeholder-secondary w-full'
                                            type='text'
                                            placeholder="Nom d'utilisateur"
                                            onChange={(e) => setUsername(e.target.value)}
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
                                        <label htmlFor='email' className='relative text-gray-400 focus-within:text-gray-600 block'>
                                            {isPasswordVisible ? (
                                                <EyeAlt
                                                    onClick={() => setIsPasswordVisible(false)}
                                                    className='w-5 h-5 absolute top-2 right-4'
                                                />
                                            ) : (
                                                <EyeClose
                                                    onClick={() => setIsPasswordVisible(true)}
                                                    className='w-5 h-5 absolute top-2  right-4'
                                                />
                                            )}
                                            <input
                                                id='password'
                                                className='form-input bg-hover rounded-full border-none text-secondary placeholder-secondary w-full'
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                placeholder='Mot de passe'
                                                autoComplete='on'
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {password.length < 6 && (
                                                <p className='text-xs text-pink-500 mt-2'>
                                                    Le mot de passe dois avoir au moins 6 characteres
                                                </p>
                                            )}
                                        </label>
                                    </div>

                                    {error && <p className='text-xs text-pink-500'>{error}</p>}
                                </div>
                                <div className='flex flex-col items-center justify-center mt-6'>
                                    <button
                                        disabled={isDisabled}
                                        className={`btn mt-2 ${
                                            isDisabled
                                                ? 'bg-card text-secondary'
                                                : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                                        } rounded-full whitespace-nowrap`}
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        {loading ? 'Chargement en cours...' : "S'inscrire"}
                                    </button>

                                    <p className='text-xs text-secondary mt-2'>
                                        En créant mon compte j&apos;accepte les CGV CGU et déclare avoir pris connaissance de la politique
                                        de confidentialité{' '}
                                        <a
                                            className='underline'
                                            href='https://www.notion.so/CGV-CGU-fac0db0184d84e178f7d707a5c4025f5?pvs=4'
                                        >
                                            ici
                                        </a>
                                    </p>
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
