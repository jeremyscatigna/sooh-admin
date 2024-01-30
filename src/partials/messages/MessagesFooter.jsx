import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect } from 'react';
import { openCreateOfferModalAtom, selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '../../pages/Signup';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../main';
import ModalBasic from '../../components/ModalBasic';
import { ArrowRight } from 'iconoir-react';

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
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: 'smooth',
        });
    };
    return (
        <div className='z-40 fixed w-full bg-card bottom-0'>
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
                                setPrice(e.target.value);
                            }}
                            placeholder='Propose un prix pour cette offre'
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
                                setOfferDetails(e.target.value);
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
                    className='text-xs font-bold text-white px-2 py-2 mr-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenCreateOfferModal(true);
                    }}
                >
                    Faire une offre
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
                        <ArrowRight className='w-4 h-4 fill-white' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessagesFooter;
