import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { openCreateOfferModalAtom, openSendMediaModalAtom, selectedConversationAtom, selectedConversationMessagesAtom } from '../../pages/Messages';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '../../pages/Signup';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../main';
import ModalBasic from '../../components/ModalBasic';
import { ArrowRight, MediaImage } from 'iconoir-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function MessagesFooter() {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedConversationMessages, setSelectedConversationMessages] = useAtom(selectedConversationMessagesAtom);
    const selectedConversation = useAtomValue(selectedConversationAtom);
    const [openCreateOfferModal, setOpenCreateOfferModal] = useAtom(openCreateOfferModalAtom);
    const [openSendMediaModal, setOpenSendMediaModal] = useAtom(openSendMediaModalAtom);
    const [price, setPrice] = React.useState('');
    const [offerDetails, setOfferDetails] = React.useState('');

    const [fileLoading, setFileLoading] = React.useState(false);
    const [progresspercent, setProgresspercent] = React.useState(0);
    const [imgUrl, setImgUrl] = React.useState('');
    const [fileType, setFileType] = React.useState('');

    const inputRef = useRef(null);

    const user = useAtomValue(currentUser);
    // const user = JSON.parse(localStorage.getItem('user'));

    const handleUpload = (e) => {
        e.preventDefault();
        setFileLoading(true);
        const file = e.target.files[0];
        console.log(file);
        if (!file) return;
        const storageRef = ref(storage, `messages/${uuidv4()}`);
        console.log(storageRef);
        const isVideo = file.type === 'video/mp4' || file.type === 'video/quicktime';
        if (isVideo) {
            setFileType('video');
        } else {
            setFileType('image');
        }
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                setFileLoading(false);
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setFileLoading(false);
                    setImgUrl(downloadURL);
                });
            },
        );
    };

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
        setOpenSendMediaModal(false);
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: 'smooth',
        });
    };
    return (
        <div className='z-40 sticky w-full bg-card bottom-0'>
            <ModalBasic title='Créer une offre' modalOpen={openCreateOfferModal} setModalOpen={() => setOpenCreateOfferModal(!openCreateOfferModal)}>
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
            <ModalBasic title='Envoyer un media' modalOpen={openSendMediaModal} setModalOpen={() => setOpenSendMediaModal(!openSendMediaModal)}>
                <div className='px-5 pt-4 pb-1 space-y-4'>
                    <div className='grow flex space-x-5'>
                        <button
                            className='inline-flex items-center text-sm font-medium text-secondary hover:text-slate-700'
                            onClick={(e) => {
                                e.stopPropagation();
                                inputRef.current.click();
                            }}
                        >
                            {!imgUrl ? (
                                <MediaImage className='w-5 h-5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded mr-2' />
                            ) : (
                                <div className='pr-3'>
                                    <img src={imgUrl} alt='uploaded file' className='w-10 h-10' />
                                </div>
                            )}

                            <span>{fileLoading ? 'Loading' : ' Ajouter un média'}</span>
                        </button>
                        <input ref={inputRef} type='file' id='file' className='hidden' onChange={handleUpload} />
                    </div>
                    
                    <div className='px-5 py-4 mb-24'>
                        <div className='flex flex-wrap justify-end space-x-2'>
                            <button
                                className='btn-sm border-primary hover:border-primary text-primary'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenSendMediaModal(false);
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
                                        type: fileType,
                                        imgUrl: imgUrl,
                                    };

                                    setSelectedConversationMessages([...selectedConversationMessages, message]);
                                    handleUpdate(e, message);
                                }}
                            >
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            </ModalBasic>
            <div className='flex items-center justify-between bg-card px-4 sm:px-6 md:px-5 h-16'>
                <button
                    className='text-xs font-bold text-white px-2 py-2 mr-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenSendMediaModal(true);
                    }}
                >
                    <MediaImage className='w-5 h-5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary rounded' />
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
