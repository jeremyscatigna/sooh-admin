import React, { useEffect, useRef } from 'react';

import { useAtomValue } from 'jotai';
import { selectedConversationMessagesAtom } from '../../pages/Messages';
import Avvvatars from 'avvvatars-react';
import { currentUser } from '../../pages/Signup';
import dayjs from 'dayjs';
import { CheckCircle, ShieldCross } from 'iconoir-react';

function MessagesBody() {
    const selectedConversationMessages = useAtomValue(selectedConversationMessagesAtom);
    const user = useAtomValue(currentUser);

    const contentArea = useRef(null);

    useEffect(() => {
        contentArea.current.scrollTop = 99999999;
    }, []);

    return (
        <div className='z-30 flex flex-col px-4 sm:px-6 md:px-5 py-6 overflow-y-scroll h-full' ref={contentArea}>
            {selectedConversationMessages &&
                selectedConversationMessages.length > 0 &&
                selectedConversationMessages.map((message) => (
                    <div className='flex items-start mb-8 last:mb-24 first:mt-24' key={message.uid}>
                        {message.senderAvatar ? (
                            <img className='rounded-full max-w-10 max-h-10 w-10 h-10 object-cover shadow-lg border-4 border-white' src={message.senderAvatar} width='40' height='40' alt='User 01' />
                        ) : (
                            <Avvvatars value={`${message.senderFirstName} ${message.senderLastName}`} />
                        )}

                        <div className='ml-4'>
                            {!message.type || message.type === 'text' ? (
                                <>
                                    <div
                                        className={`text-sm ${
                                            message.senderFirstName === user.firstName
                                                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary'
                                                : 'bg-white text-slate-800'
                                        } p-3 rounded-xl rounded-tl-none shadow-md mb-1`}
                                    >
                                        {message.text}
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        {message.timestamp && (
                                            <div className='text-xs text-slate-500 font-medium'>
                                                Il y a {dayjs(message.timestamp).fromNow(true)}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {message.type === 'offer' && (
                                        <div className='border rounded-xl border-pink-500 p-4'>
                                            <div className='flex flex-col items-start justify-center'>
                                                <div className='text-sm font-medium text-primary'>Prix: {message.price}€</div>
                                                <div className='text-sm font-medium text-primary'>Details: {message.details}</div>

                                                <div className='flex items-center justify-between w-full mt-4'>
                                                    <button
                                                        className='flex flex-row items-center justify-center'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <CheckCircle className='w-6 h-6 fill-green mr-2 text-green-500' />
                                                        Accepter
                                                    </button>
                                                    <button
                                                        className='flex flex-row items-center justify-center'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <ShieldCross className='w-6 h-6 fill-red mr-2 text-red-600' />
                                                        Refuser
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {message.type === 'image' && <img className='rounded-xl h-64 w-38' src={message.imgUrl} alt='Image' />}

                                    {message.type === 'video' && (
                                        <video
                                            className='rounded-xl h-72 w-48'
                                            width='590'
                                            height='332'
                                            poster={message.imgUrl}
                                            src={message.imgUrl}
                                            autoPlay
                                            muted
                                            playsInline
                                            loop
                                            controls
                                        ></video>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default MessagesBody;
