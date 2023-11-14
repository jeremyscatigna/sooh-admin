import React from 'react';

import UserImage01 from '../../images/user-32-01.jpg';
import Avvvatars from 'avvvatars-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { conversationsAtom, selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';
import { useSearchParams } from 'react-router-dom';

function DirectMessages({ setMsgSidebarOpen }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const conversations = useAtomValue(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
    const setSelectedConversationMessages = useSetAtom(selectedConversationMessagesAtom);
    return (
        <div className='mt-4'>
            <div className='text-xs font-semibold text-primary uppercase mb-3'>Messages ({conversations.length})</div>
            {conversations.length > 0 && (
                <ul className='mb-6'>
                    {conversations.map((conversation) => (
                        <li className='-mx-2' key={conversation.uid}>
                            <button
                                className={`flex items-center justify-between w-full p-2 rounded-xl ${
                                    selectedConversation?.uid === conversation.uid ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600' : 'hover:bg-hover'
                                } transition duration-150 ease-in-out`}
                                onClick={() => {
                                    console.log(conversation);
                                    setSelectedConversation(conversation);
                                    setSearchParams({ conversation: conversation.uid });
                                    setSelectedConversationMessages(conversation.messages);
                                    setMsgSidebarOpen(false)
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
                                            {conversation.userFirstName} {conversation.userLastName}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DirectMessages;
