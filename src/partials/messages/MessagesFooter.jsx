import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { openCreateOfferModalAtom, selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '../../pages/Signup';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../main';
import ModalBasic from '../../components/ModalBasic';

function MessagesFooter() {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedConversationMessages, setSelectedConversationMessages] = useAtom(selectedConversationMessagesAtom);
    const selectedConversation = useAtomValue(selectedConversationAtom);
    const [openCreateOfferModal, setOpenCreateOfferModal] = useAtom(openCreateOfferModalAtom);
    const [price, setPrice] = React.useState('');
    const [offerDetails, setOfferDetails] = React.useState('');

    const user = useAtomValue(currentUser);

    const handleUpdate = async (e, message) => {
        e.preventDefault();

        setInputValue('');

        const convcollref = doc(db, 'users', user.uid, 'conversations', selectedConversation.id);

        const res = await getDocs(collection(db, `users/${selectedConversation.userId}/conversations`));
        const conv = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const convDocumentId = conv.filter((conv) => conv.userId === user.uid)[0].id;

        const othercollref = doc(db, 'users', selectedConversation.userId, 'conversations', convDocumentId);

        updateDoc(convcollref, {
            messages: [...selectedConversationMessages, message],
        });

        updateDoc(othercollref, {
            messages: [...selectedConversationMessages, message],
        });

        setOpenCreateOfferModal(false);
    };
    return (
        <div className='fixed bottom-16 w-full'>
            <ModalBasic title='Créer une offre' modalOpen={openCreateOfferModal}>
                <div className='px-5 pt-4 pb-1 space-y-4'>
                    <div>
                        <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                            Prix
                        </label>
                        <input
                            id='placeholder'
                            className='form-input rounded-full border-none bg-hover text-secondary placeholder-secondary w-full'
                            type='text'
                            value={price}
                            onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPrice(e.target.value)
                                }}
                            placeholder='Propse un prix pour cette offre'
                        />
                    </div>
                    <div>
                        <label className='block text-sm text-primary font-medium mb-1' htmlFor='placeholder'>
                            Prix
                        </label>
                        <textarea
                            id='placeholder'
                            className='form-input rounded-xl border-none bg-hover text-secondary placeholder-secondary w-full'
                            type='text'
                            rows={5}
                            value={offerDetails}
                            onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOfferDetails(e.target.value)
                            }}
                            placeholder='Ajoutez autant de détails que possible pour faciliter la collaboration'
                        />
                    </div>
                    <div className='px-5 py-4 mb-24'>
                        <div className='flex flex-wrap justify-end space-x-2'>
                            <button
                                className='btn-sm border-primary hover:border-primary text-primary'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenCreateOfferModal(false);
                                }}
                            >
                                Fermer
                            </button>
                            <button
                                className='btn-sm rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                                onClick={(e) => {
                                    e.stopPropagation();

                                    const message = {
                                        id: uuidv4(),
                                        text: offerDetails,
                                        senderFirstName: user.firstName,
                                        senderLastName: user.lastName,
                                        senderAvatar: user.avatar,
                                        type: 'offer',
                                        price: price,
                                        details: offerDetails,
                                        accepted: false,
                                    };

                                    setSelectedConversationMessages([...selectedConversationMessages, message]);
                                    handleUpdate(e, message);
                                }}
                            >
                                Creer
                            </button>
                        </div>
                    </div>
                </div>
            </ModalBasic>
            <div className='flex items-center justify-between bg-card px-4 sm:px-6 md:px-5 h-16'>
                {/* Plus button */}
                <button
                    className='shrink-0 text-hover hover:text-slate-500 mr-3'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenCreateOfferModal(true);
                    }}
                >
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
                            className='form-input w-full bg-hover border-transparent rounded-full text-secondary placeholder-secondary'
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
                                type: 'text',
                            };

                            setSelectedConversationMessages([...selectedConversationMessages, message]);
                            handleUpdate(e, message);
                        }}
                        className='btn bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded-full whitespace-nowrap'
                    >
                        Send -&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessagesFooter;
