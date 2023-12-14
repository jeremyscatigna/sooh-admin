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
            {selectedConversationMessages && selectedConversationMessages.length === 0 && (
                <div className='flex flex-col items-center justify-center h-full p-4'>
                    <ol className='flex flex-col items-start justify-start text-sm text-slate-300 relative border-s border-gray-200'>
                        <li className='mb-10 ms-6'>
                            <span className='absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-pink-900 bg-pink-500'>
                                <div className='font-bold'>1</div>
                            </span>
                            Échangez sur les termes de votre collaboration. Définissez le type de contenu souhaité, et le mode de diffusion
                            du contenu
                        </li>
                        <li className='mb-10 ms-6'>
                            <span className='absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-pink-900 bg-pink-500'>
                                <div className='font-bold'>2</div>
                            </span>
                            Faites une offre de prix pour le contenu souhaité
                        </li>
                        <li className='mb-10 ms-6'>
                            <span className='absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-pink-900 bg-pink-500'>
                                <div className='font-bold'>3</div>
                            </span>
                            A acceptation de l&apos;offre, un prépaiement en faveur du créateur de contenu est enregistré
                        </li>
                        <li className='mb-10 ms-6'>
                            <span className='absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-pink-900 bg-pink-500'>
                                <div className='font-bold'>4</div>
                            </span>
                            Lorsque le contenu est prêt, partagez le sur cette messagerie avant diffusion. (Tant que ce contenu ne sera pas
                            validé par le professionnel, il ne sera ni telechargeable, ni partageable)
                        </li>
                        <li className='mb-10 ms-6'>
                            <span className='absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-pink-900 bg-pink-500'>
                                <div className='font-bold'>5</div>
                            </span>
                            Lorsque le professionnel valide ce contenu, le paiement est définitivement validé en faveur du créateur de
                            contenu.
                        </li>
                        <li className='mb-10 ms-6'>
                            <span className='absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-pink-900 bg-pink-500'>
                                <div className='font-bold'>6</div>
                            </span>
                            Ces échanges par messages ont valeur de contrat. Veillez à les conserver si besoin. (Loi 2023-451 du 9 juin 2023
                            visant à encadrer l&apos;influence)
                        </li>
                    </ol>
                </div>
            )}
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
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default MessagesBody;
