import React, { useEffect, useState } from 'react';

import Avvvatars from 'avvvatars-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentUser } from '../../pages/Signup';
import { Edit, Facebook, Instagram, TikTok, Twitter, YouTube } from 'iconoir-react';
import { signOut } from 'firebase/auth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../main';
import { selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';

function ProfileBody({ profileSidebarOpen, setProfileSidebarOpen, setBasicModalOpen, user, posts, influencer }) {
    const connectedUser = useAtomValue(currentUser);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [conversations, setConversations] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
    const setSelectedConversationMessages = useSetAtom(selectedConversationMessagesAtom);
    const navigate = useNavigate();

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
        const fetchConversations = async () => {
            const res = await getDocs(collection(db, `users/${connectedUser.uid}/conversations`));

            setConversations(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            console.log(res.docs.map((doc) => doc.data()));
        };

        if (conversations === undefined || conversations.length === 0) {
            fetchConversations();
        }
    }, [conversations]);

    const doesConversationExist = () => {
        const conv = conversations.filter((conversation) => conversation.userId === user.uid);
        if (conv.length > 0) {
            setSelectedConversation(conv[0]);
            setSearchParams({ conversation: conv[0].uid });
            setSelectedConversationMessages(conv[0].messages);
            navigate(`/messages`);
        } else {
            navigate(`/messages`);
        }
    };

    console.log(influencer);

    return (
        <div
            className={`grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out ${
                profileSidebarOpen ? 'translate-x-1/3' : 'translate-x-0'
            }`}
        >
            {/* Content */}
            <div className='relative px-4 sm:px-6 pb-8'>
                <Link
                    className='btn-sm mt-4 rounded-full px-3 bg-hover hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary'
                    to={user.type === 'influencer' ? '/influencers' : '/'}
                >
                    <svg className='fill-current text-primary mr-2' width='7' height='12' viewBox='0 0 7 12'>
                        <path d='M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z' />
                    </svg>
                    <span>Retours</span>
                </Link>
                {/* Pre-header */}
                <div className='mt-8 mb-6 sm:mb-3'>
                    <div className='flex flex-col items-center sm:flex-row sm:justify-between sm:items-end'>
                        {/* Avatar */}
                        <div className='inline-flex -ml-1 -mt-1 mb-4 sm:mb-0'>
                            {user.avatar ? (
                                <img
                                    className='rounded-full max-w-32 max-h-32 w-32 h-32 object-cover shadow-lg border-4 border-white'
                                    src={user.avatar}
                                    width='128'
                                    height='128'
                                    alt='Avatar'
                                />
                            ) : (
                                <Avvvatars size={128} value={`${user.firstName} ${user.lastName}`} />
                            )}
                        </div>

                        {/* Actions */}
                        {connectedUser.uid !== user.uid ? (
                            <div className='flex space-x-2 sm:mb-2'>
                                <button
                                    onClick={() => {
                                        doesConversationExist();
                                    }}
                                    className='p-3 shrink-0 rounded-full border-none bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-sm'
                                >
                                    <svg className='w-4 h-4 fill-current text-white' viewBox='0 0 16 16'>
                                        <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7Zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8Z' />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className='flex space-x-2 sm:mb-2'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBasicModalOpen(true);
                                    }}
                                    className='btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full p-2 hover:bg-indigo-600 text-white'
                                >
                                    <Edit />
                                </button>
                                <Link
                                    className='btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full p-2 hover:bg-indigo-600 text-white'
                                    to='/signin'
                                    onClick={() => {
                                        signOut();
                                    }}
                                >
                                    Se deconnecter
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Header */}
                <header className='text-center sm:text-left mb-6'>
                    {/* Name */}
                    <div className='inline-flex items-start mb-2'>
                        <h1 className='text-2xl text-primary font-bold'>
                            {user.username && user.username !== '' ? user.username : user.firstName + ' ' + user.lastName}
                        </h1>
                    </div>
                    {/* Bio */}
                    <div className='text-sm mb-3'>
                        {influencer.influBio
                            ? influencer.influBio
                            : user.details !== ''
                            ? user.details
                            : 'Ecris ta bio pour te presenter au monde'}
                    </div>
                    {influencer.city && (
                        <div className='mb-4'>
                            <div
                                className={`flex ${
                                    mobile ? 'items-center text-center justify-center' : 'items-start'
                                } text-sm text-secondary`}
                            >
                                {influencer.city}
                                {influencer.followers ? ' • ' : ''}
                                {influencer.followers}
                                {influencer.minPrice && influencer.maxPrice ? ' • ' : ''}

                                {influencer.minPrice && influencer.maxPrice && (
                                    <div className='text-center text-secondary'>
                                        <div className='text-sm'>
                                            Tarif : {influencer.minPrice}€ - {influencer.maxPrice}€
                                        </div>
                                    </div>
                                )}
                            </div>
                            {influencer.category && (
                                <div
                                    className={`flex ${
                                        mobile ? 'items-center text-center justify-center' : 'items-start'
                                    } text-sm text-secondary`}
                                >
                                    {influencer.category}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Meta */}
                    {mobile ? (
                        <div className='flex flex-col justify-center items-center space-y-2'>
                            {Object.keys(influencer).length !== 0 ? (
                                <>
                                    <div className='flex items-center'>
                                        {influencer.instagram && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.instagram}
                                            >
                                                <Instagram />
                                            </a>
                                        )}
                                        {influencer.tiktok && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.tiktok}
                                            >
                                                <TikTok />
                                            </a>
                                        )}
                                        {influencer.youtube && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.youtube}
                                            >
                                                <YouTube />
                                            </a>
                                        )}
                                        {influencer.twitter && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.twitter}
                                            >
                                                <svg
                                                    className='h-5 w-5'
                                                    width='24px'
                                                    height='24px'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth='1.5'
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    color='#ec489a'
                                                >
                                                    <path
                                                        d='M16.8198 20.7684L3.75317 3.96836C3.44664 3.57425 3.72749 3 4.22678 3H6.70655C6.8917 3 7.06649 3.08548 7.18016 3.23164L20.2468 20.0316C20.5534 20.4258 20.2725 21 19.7732 21H17.2935C17.1083 21 16.9335 20.9145 16.8198 20.7684Z'
                                                        stroke='#ec489a'
                                                        strokeWidth='1.5'
                                                    ></path>
                                                    <path d='M20 3L4 21' stroke='#ec489a' strokeWidth='1.5' strokeLinecap='round'></path>
                                                </svg>
                                            </a>
                                        )}
                                        {influencer.facebook && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.facebook}
                                            >
                                                <Facebook />
                                            </a>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='flex items-center'>
                                        <svg className='w-4 h-4 fill-current shrink-0 text-secondary' viewBox='0 0 16 16'>
                                            <path d='M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z' />
                                        </svg>
                                        <a className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2' href='#0'>
                                            {user.email || 'Ajoute ton email'}
                                        </a>
                                    </div>
                                    <div className='flex items-center'>
                                        <svg className='w-4 h-4 fill-current shrink-0 text-secondary' viewBox='0 0 16 16'>
                                            <path d='M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z' />
                                        </svg>
                                        <span className='text-sm font-medium whitespace-nowrap text-secondary ml-2'>
                                            {influencer.city ? influencer.city : user.location || 'Ajoute ta localisation'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className='flex justify-start items-center space-x-2'>
                            {Object.keys(influencer).length !== 0 ? (
                                <>
                                    <div className='flex items-center'>
                                        {influencer.instagram && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.instagram}
                                            >
                                                <Instagram />
                                            </a>
                                        )}
                                        {influencer.tiktok && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.tiktok}
                                            >
                                                <TikTok />
                                            </a>
                                        )}
                                        {influencer.youtube && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.youtube}
                                            >
                                                <YouTube />
                                            </a>
                                        )}
                                        {influencer.twitter && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.twitter}
                                            >
                                                <Twitter />
                                            </a>
                                        )}
                                        {influencer.facebook && (
                                            <a
                                                className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2'
                                                href={influencer.facebook}
                                            >
                                                <Facebook />
                                            </a>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='flex items-center'>
                                        <svg className='w-4 h-4 fill-current shrink-0 text-secondary' viewBox='0 0 16 16'>
                                            <path d='M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z' />
                                        </svg>
                                        <a className='text-sm font-medium whitespace-nowrap text-pink-500 ml-2' href='#0'>
                                            {user.email || 'Ajoute ton email'}
                                        </a>
                                    </div>
                                    <div className='flex items-center'>
                                        <svg className='w-4 h-4 fill-current shrink-0 text-secondary' viewBox='0 0 16 16'>
                                            <path d='M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z' />
                                        </svg>
                                        <span className='text-sm font-medium whitespace-nowrap text-secondary ml-2'>
                                            {influencer.city ? influencer.city : user.location || 'Ajoute ta localisation'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </header>

                {/* Profile content */}
                <div className='flex flex-col xl:flex-row xl:space-x-16'>
                    {/* Main content */}
                    <div className='space-y-5 mb-8 xl:mb-0'>
                        {/* About Me */}
                        <div className={`${mobile && 'flex flex-col items-center justify-center w-full'}`}>
                            <h3 className='text-primary font-semibold mb-2'>À propos</h3>
                            <div className='text-sm space-y-2'>
                                <p>{user.description || 'Ajoute une description pour te presenter au monde'}</p>
                            </div>
                        </div>

                        {/* Departments */}
                        {/* <div>
              <h2 className="text-slate-800 font-semibold mb-2">Departments</h2>
              
              <div className="grid xl:grid-cols-2 gap-4">
                
                <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
                 
                  <div className="grow flex items-center truncate mb-2">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-slate-700 rounded-full mr-2">
                      <img className="ml-1" src={Icon03} width="14" height="14" alt="Icon 03" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-medium text-slate-800">Acme Marketing</span>
                    </div>
                  </div>
                  
                  <div className="text-sm mb-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
                  
                  <div className="flex justify-between items-center">
                    
                    <div className="flex -space-x-3 -ml-0.5">
                      <img className="rounded-full border-2 border-white box-content" src={UserImage02} width="24" height="24" alt="Avatar" />
                      <img className="rounded-full border-2 border-white box-content" src={UserImage03} width="24" height="24" alt="Avatar" />
                      <img className="rounded-full border-2 border-white box-content" src={UserImage04} width="24" height="24" alt="Avatar" />
                      <img className="rounded-full border-2 border-white box-content" src={UserImage05} width="24" height="24" alt="Avatar" />
                    </div>
                    
                    <div>
                      <a className="text-sm font-medium text-indigo-500 hover:text-indigo-600" href="#0">
                        View -&gt;
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">
                  
                  <div className="grow flex items-center truncate mb-2">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-slate-700 rounded-full mr-2">
                      <img className="ml-1" src={Icon02} width="14" height="14" alt="Icon 02" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-medium text-slate-800">Acme Product</span>
                    </div>
                  </div>
                  
                  <div className="text-sm mb-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</div>
                  
                  <div className="flex justify-between items-center">
                    
                    <div className="flex -space-x-3 -ml-0.5">
                      <img className="rounded-full border-2 border-white box-content" src={UserImage06} width="24" height="24" alt="Avatar" />
                      <img className="rounded-full border-2 border-white box-content" src={UserImage03} width="24" height="24" alt="Avatar" />
                      <img className="rounded-full border-2 border-white box-content" src={UserImage01} width="24" height="24" alt="Avatar" />
                    </div>
                    
                    <div>
                      <a className="text-sm font-medium text-indigo-500 hover:text-indigo-600" href="#0">
                        View -&gt;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

                        {/* Work History */}
                        <div className={`${mobile && ' flex flex-col items-center justify-center'}`}>
                            <h3 className='text-primary font-semibold mb-2'>Posts</h3>

                            <div className={`grid ${mobile ? 'grid-cols-1' : 'grid-cols-4'} gap-4`}>
                                {posts.map((item, i) => (
                                    <div key={item.uid} className='bg-card shadow-md rounded-xl p-5'>
                                        <div
                                            className={`flex flex-col ${
                                                !mobile && 'items-center justify-center'
                                            } text-sm text-primary space-y-2`}
                                        >
                                            {item.imageUrl && (
                                                <div className='relative flex items-center justify-center !my-4'>
                                                    <video
                                                        className='block w-full'
                                                        width='590'
                                                        height='332'
                                                        poster={item.imageUrl}
                                                        src={item.imageUrl}
                                                        muted
                                                        playsInline
                                                        autoPlay
                                                        loop
                                                    ></video>
                                                </div>
                                            )}
                                            <p className={`${!mobile && 'justify-center'}`}>{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileBody;
