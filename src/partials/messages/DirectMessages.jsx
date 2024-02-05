import React, { useEffect, useRef, useState } from 'react';

import Avvvatars from 'avvvatars-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { conversationsAtom, msgSidebarOpenAtom, selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';
import { useSearchParams } from 'react-router-dom';
import { Trash } from 'iconoir-react';
import ModalBlank from '../../components/ModalBlank';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../main';
import { currentUser } from '../../pages/Signup';

function DirectMessages() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [msgSidebarOpen, setMsgSidebarOpen] = useAtom(msgSidebarOpenAtom);
    const [conversations, setConversations] = useAtom(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
    const setSelectedConversationMessages = useSetAtom(selectedConversationMessagesAtom);
    const [conversationToDelete, setConversationToDelete] = useState(null);
    const [dangerModalOpen, setDangerModalOpen] = useState(false);

    const user = useAtomValue(currentUser);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    useEffect(() => {
        setSelectedConversation(conversations.find((conv) => conv.uid === searchParams.get('conversation')));
    }, [conversations, selectedConversation, searchParams, setSelectedConversation]);

    const deleteConversation = async (conversationId) => {
        const conversationRef = doc(db, 'users', user.uid, 'conversations', conversationId);
        deleteDoc(conversationRef);
        const conversationWithoutDeleted = conversations.filter((conv) => conv.id !== conversationId);
        setConversations(conversationWithoutDeleted);
        setSelectedConversation(null);
        setDangerModalOpen(false);
    };

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <div className='mt-4'>
            <ModalBlank id='basic-modal' className='bg-card rounded-xl' modalOpen={dangerModalOpen} setModalOpen={setDangerModalOpen}>
                <div className='p-5 flex flex-col space-y-4 justify-center items-center bg-card rounded-xl'>
                    {/* Icon */}
                    <div className='w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100'>
                        <svg className='w-4 h-4 shrink-0 fill-current text-rose-500' viewBox='0 0 16 16'>
                            <path d='M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z' />
                        </svg>
                    </div>

                    <div className='text-lg font-semibold text-primary text-center'>Supprimer cette conversation ?</div>

                    {/* Modal footer */}

                    <button
                        onClick={() => {
                            deleteConversation(conversationToDelete);
                        }}
                        className='btn-sm rounded-xl bg-rose-500 hover:bg-rose-600 text-white'
                    >
                        Supprimer
                    </button>
                </div>
            </ModalBlank>

            <div className='text-xs font-semibold text-primary uppercase mb-3'>Messages ({conversations.length})</div>
            {conversations.length > 0 && (
                <ul className='mb-6'>
                    {conversations.map((conversation) => (
                        <li className='-mx-2' key={conversation.uid}>
                            <button
                                className={`flex items-center justify-between w-full p-2 rounded-xl ${
                                    selectedConversation?.uid === conversation.uid
                                        ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600'
                                        : 'hover:bg-hover'
                                } transition duration-150 ease-in-out`}
                                onClick={() => {
                                    console.log(conversation);
                                    setSelectedConversation(conversation);
                                    setSearchParams({ conversation: conversation.uid });
                                    setSelectedConversationMessages(conversation.messages);
                                    setMsgSidebarOpen(false);
                                }}
                            >
                                <div className='flex items-center truncate'>
                                    {conversation.userAvatar ? (
                                        <img
                                            className='w-8 h-8 rounded-full mr-2'
                                            src={conversation.userAvatar}
                                            width='32'
                                            height='32'
                                            alt='User 01'
                                        />
                                    ) : (
                                        <Avvvatars value={`${conversation.userFirstName} ${conversation.userLastName}`} />
                                    )}

                                    <div className='truncate ml-2'>
                                        <span className='text-sm font-medium text-primary'>
                                            {conversation.username && conversation.username !== ''
                                                ? conversation.username
                                                : conversation.userFirstName + ' ' + conversation.userLastName}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setConversationToDelete(conversation.id);
                                        setDangerModalOpen(true);
                                    }}
                                >
                                    <Trash className='w-4 h-4 fill-current text-primary' />
                                </button>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DirectMessages;
