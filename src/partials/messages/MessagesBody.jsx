import React from 'react';

import User01 from '../../images/user-40-11.jpg';
import User02 from '../../images/user-40-12.jpg';
import ChatImage from '../../images/chat-image.jpg';
import { useAtomValue } from 'jotai';
import { selectedConversationMessagesAtom } from '../../pages/Messages';
import Avvvatars from 'avvvatars-react';
import { currentUser } from '../../pages/Signup';
import dayjs from 'dayjs';

function MessagesBody() {
    const selectedConversationMessages = useAtomValue(selectedConversationMessagesAtom);
    const user = useAtomValue(currentUser);
    return (
        <div className='grow px-4 sm:px-6 md:px-5 py-6'>
            {selectedConversationMessages &&
                selectedConversationMessages.length > 0 &&
                selectedConversationMessages.map((message, index) => (
                    <div className='flex items-start mb-4 last:mb-0' key={message.uid}>
                        {message.senderAvatar ? (
                            <img className='rounded-full mr-4 w-10 h-10' src={message.senderAvatar} width='40' height='40' alt='User 01' />
                        ) : (
                            <Avvvatars value={`${message.senderFirstName} ${message.senderLastName}`} />
                        )}

                        <div className='ml-4'>
                            <div className={`text-sm ${message.senderFirstName === user.firstName ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary' : 'bg-white text-slate-800'} p-3 rounded-xl rounded-tl-none shadow-md mb-1`}>
                                {message.text}
                            </div>
                            <div className='flex items-center justify-between'>
                                {message.timestamp && <div className='text-xs text-slate-500 font-medium'>Il y a {dayjs(message.timestamp).fromNow(true)}</div>}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default MessagesBody;
