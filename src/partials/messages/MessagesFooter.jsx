import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import { selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '../../pages/Signup';
import { collection, doc, getDocs, updateDoc, where } from 'firebase/firestore';
import { db } from '../../main';

function MessagesFooter() {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedConversationMessages, setSelectedConversationMessages] = useAtom(selectedConversationMessagesAtom);
    const selectedConversation = useAtomValue(selectedConversationAtom);

    const user = useAtomValue(currentUser);

    const handleUpdate = async (e, message) => {
        e.preventDefault();

        setInputValue('');

        const convcollref = doc(db, 'users', user.uid, 'conversations', selectedConversation.id)

        const res = await getDocs(collection(db, `users/${selectedConversation.userId}/conversations`));
        const conv = res.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const convDocumentId = conv.filter((conv) => conv.userId === user.uid)[0].id;

        const othercollref = doc(db, 'users', selectedConversation.userId, 'conversations', convDocumentId)
        
        updateDoc(convcollref, {
            messages: [...selectedConversationMessages, message],
        });

        updateDoc(othercollref, {
          messages: [...selectedConversationMessages, message],
      });
    };
    return (
        <div className='sticky bottom-0'>
            <div className='flex items-center justify-between bg-white border-t border-slate-200 px-4 sm:px-6 md:px-5 h-16'>
                {/* Plus button */}
                <button className='shrink-0 text-slate-400 hover:text-slate-500 mr-3'>
                    <span className='sr-only'>Add</span>
                    <svg className='w-6 h-6 fill-current' viewBox='0 0 24 24'>
                        <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12C23.98 5.38 18.62.02 12 0zm6 13h-5v5h-2v-5H6v-2h5V6h2v5h5v2z' />
                    </svg>
                </button>
                {/* Message input */}
                <div className='grow flex'>
                    <div className='grow mr-3'>
                        <label htmlFor='message-input' className='sr-only'>
                            Type a message
                        </label>
                        <input
                            id='message-input'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className='form-input w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300'
                            type='text'
                            placeholder='Aa'
                        />
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const message = {
                                id: uuidv4(),
                                text: inputValue,
                                senderFirstName: user.firstName,
                                senderLastName: user.lastName,
                                senderAvatar: user.avatar,
                            };

                            setSelectedConversationMessages([...selectedConversationMessages, message]);
                            handleUpdate(e, message);
                        }}
                        className='btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap'
                    >
                        Send -&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessagesFooter;
