import React, { useState, useEffect, useRef } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import MessagesSidebar from '../partials/messages/MessagesSidebar';
import MessagesHeader from '../partials/messages/MessagesHeader';
import MessagesBody from '../partials/messages/MessagesBody';
import MessagesFooter from '../partials/messages/MessagesFooter';
import { useParams, useSearchParams } from 'react-router-dom';
import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { atom, useAtom, useAtomValue } from 'jotai';
import { currentUser } from './Signup';
import { auth, db } from '../main';
import ModalBasic from '../components/ModalBasic';

export const conversationsAtom = atom([]);
export const selectedConversationAtom = atom({});
export const usersAtom = atom([]);
export const searchAtom = atom('');
export const selectedConversationMessagesAtom = atom([]);
export const openCreateOfferModalAtom = atom(false);
export const msgSidebarOpenAtom = atom(true);

const getLocaleDateTime = () => {
    let d = new Date();
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    return dateTimeLocalValue;
};

function Messages() {
    const contentArea = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [msgSidebarOpen, setMsgSidebarOpen] = useState(msgSidebarOpenAtom);
    const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
    const [users, setUsers] = useAtom(usersAtom);
    const [conversations, setConversations] = useAtom(conversationsAtom);
    const [selectedConversationMessages, setSelectedConversationMessages] = useAtom(selectedConversationMessagesAtom);
    const [openCreateOfferModal, setOpenCreateOfferModal] = useAtom(openCreateOfferModalAtom);

    const authenticatedUser = useAtomValue(currentUser);
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
        const fetchConversations = async () => {
            const res = await getDocs(collection(db, `users/${authenticatedUser.uid}/conversations`));

            const conversationsWithoutDeleted = res.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((conversation) => !conversation.deleted);

            setConversations(conversationsWithoutDeleted);
            console.log(res.docs.map((doc) => doc.data()));
        };

        if (conversations === undefined || conversations.length === 0) {
            fetchConversations();
        }
    }, [conversations]);

    useEffect(() => {
        if (searchParams.get('conversation')) {
            setSelectedConversation(conversations.find((conversation) => conversation.uid === searchParams.get('conversation')));
            const conv = conversations.find((conversation) => conversation.uid === searchParams.get('conversation'));
            if (conv) {
                setSelectedConversationMessages(conv.messages || []);
            }
        }
    }, [searchParams.get('conversation'), conversations]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getDocs(collection(db, 'users'));

            setUsers(res.docs.map((doc) => doc.data()));
            console.log(res.docs.map((doc) => doc.data()));
        };

        fetchUser();
    }, []);

    const createConversation = async (user) => {
        console.log(user);
        console.log(authenticatedUser);
        try {
            const res = await getDocs(collection(db, `users/${authenticatedUser.uid}/conversations`));
            const conversations = res.docs.map((doc) => doc.data());
            const conversation = conversations.find((conversation) => conversation.userId === user.uid);
            if (conversation) {
                setSelectedConversation(conversation);
            } else {
                const newConversation = {
                    uid: uuidv4(),
                    userId: user.uid,
                    toUserId: authenticatedUser.uid,
                    userFirstName: user.firstName,
                    userLastName: user.lastName,
                    userAvatar: user.avatar,
                    messages: [],
                    timestamp: getLocaleDateTime(),
                };

                const newUserConversation = {
                    uid: newConversation.uid,
                    userId: authenticatedUser.uid,
                    toUserId: user.uid,
                    userFirstName: authenticatedUser.firstName,
                    userLastName: authenticatedUser.lastName,
                    userAvatar: authenticatedUser.avatar,
                    messages: [],
                    timestamp: getLocaleDateTime(),
                };
                await addDoc(collection(db, `users/${authenticatedUser.uid}/conversations`), { ...newConversation });
                await addDoc(collection(db, `users/${user.uid}/conversations`), { ...newUserConversation });
                setSelectedConversation(newConversation);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        contentArea.current.scrollTop = 99999999;
    }, [msgSidebarOpen]); // automatically scroll the chat and make the most recent message visible

    return (
        <div className='flex h-screen overflow-hidden bg-card'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden h-screen' ref={contentArea}>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main className='h-screen bg-card'>
                    <div className='flex h-full'>
                        {/* Messages sidebar */}
                        <MessagesSidebar
                            createConversation={createConversation}
                        />

                        {/* Messages body */}
                        <div className={`grow flex bg-card flex-col md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                            {selectedConversation && selectedConversation.uid ? (
                                <div className='h-full flex flex-col flex-1'>
                                    
                                        <MessagesHeader />
                                   

                                    <MessagesBody />
                                    <MessagesFooter />
                                </div>
                            ) : (
                                <>
                                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <svg
                                                width='250'
                                                height='200'
                                                viewBox='0 0 250 200'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <rect width='250' height='200' fill='none' />
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M63 134H154C154.515 134 155.017 133.944 155.5 133.839C155.983 133.944 156.485 134 157 134H209C212.866 134 216 130.866 216 127C216 123.134 212.866 120 209 120H203C199.134 120 196 116.866 196 113C196 109.134 199.134 106 203 106H222C225.866 106 229 102.866 229 99C229 95.134 225.866 92 222 92H200C203.866 92 207 88.866 207 85C207 81.134 203.866 78 200 78H136C139.866 78 143 74.866 143 71C143 67.134 139.866 64 136 64H79C75.134 64 72 67.134 72 71C72 74.866 75.134 78 79 78H39C35.134 78 32 81.134 32 85C32 88.866 35.134 92 39 92H64C67.866 92 71 95.134 71 99C71 102.866 67.866 106 64 106H24C20.134 106 17 109.134 17 113C17 116.866 20.134 120 24 120H63C59.134 120 56 123.134 56 127C56 130.866 59.134 134 63 134ZM226 134C229.866 134 233 130.866 233 127C233 123.134 229.866 120 226 120C222.134 120 219 123.134 219 127C219 130.866 222.134 134 226 134Z'
                                                    fill='#F3F7FF'
                                                />
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M113.119 112.307C113.04 112.86 113 113.425 113 114C113 120.627 118.373 126 125 126C131.627 126 137 120.627 137 114C137 113.425 136.96 112.86 136.881 112.307H166V139C166 140.657 164.657 142 163 142H87C85.3431 142 84 140.657 84 139V112.307H113.119Z'
                                                    fill='white'
                                                />
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M138 112C138 119.18 132.18 125 125 125C117.82 125 112 119.18 112 112C112 111.767 112.006 111.536 112.018 111.307H84L93.5604 83.0389C93.9726 81.8202 95.1159 81 96.4023 81H153.598C154.884 81 156.027 81.8202 156.44 83.0389L166 111.307H137.982C137.994 111.536 138 111.767 138 112Z'
                                                    fill='white'
                                                />
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M136.098 112.955C136.098 118.502 131.129 124 125 124C118.871 124 113.902 118.502 113.902 112.955C113.902 112.775 113.908 111.596 113.918 111.419H93L101.161 91.5755C101.513 90.6338 102.489 90 103.587 90H146.413C147.511 90 148.487 90.6338 148.839 91.5755L157 111.419H136.082C136.092 111.596 136.098 112.775 136.098 112.955Z'
                                                    fill='#E8F0FE'
                                                />
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M85.25 111.512V138C85.25 138.966 86.0335 139.75 87 139.75H163C163.966 139.75 164.75 138.966 164.75 138V111.512L155.255 83.4393C155.015 82.7285 154.348 82.25 153.598 82.25H96.4023C95.6519 82.25 94.985 82.7285 94.7446 83.4393L85.25 111.512Z'
                                                    stroke='#1F64E7'
                                                    strokeWidth='2.5'
                                                />
                                                <path
                                                    d='M98 111C101.937 111 106.185 111 110.745 111C112.621 111 112.621 112.319 112.621 113C112.621 119.627 118.117 125 124.897 125C131.677 125 137.173 119.627 137.173 113C137.173 112.319 137.173 111 139.05 111H164M90.5737 111H93H90.5737Z'
                                                    stroke='#1F64E7'
                                                    strokeWidth='2.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                />
                                                <path
                                                    d='M150.1 58.3027L139 70.7559M124.1 54V70.7559V54ZM98 58.3027L109.1 70.7559L98 58.3027Z'
                                                    stroke='#75A4FE'
                                                    strokeWidth='2.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                />
                                            </svg>
                                            <p>Sélectionnez une conversation ou créez-en une nouvelle en recherchant un utilisateur.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Messages;
