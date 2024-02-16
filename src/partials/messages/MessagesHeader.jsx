import React from 'react';

import User01 from '../../images/user-32-01.jpg';
import User02 from '../../images/user-32-07.jpg';
import { Plus } from 'iconoir-react';
import ModalBasic from '../../components/ModalBasic';
import DirectMessages from './DirectMessages';
import { useAtom, useAtomValue } from 'jotai';
import { msgSidebarOpenAtom, selectedConversationAtom } from '../../pages/Messages';
import Avvvatars from 'avvvatars-react';
import { currentUser } from '../../pages/Signup';

function MessagesHeader() {
    const [basicModalOpen, setBasicModalOpen] = React.useState(false);
    const [msgSidebarOpen, setMsgSidebarOpen] = useAtom(msgSidebarOpenAtom);
    const selectedConversation = useAtomValue(selectedConversationAtom);
    // const authenticatedUser = useAtomValue(currentUser);
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className='z-40 fixed top-0 bg-card w-full'>
            <div className='flex items-center justify-between bg-card px-4 sm:px-6 md:px-5 h-16'>
                {/* People */}
                <div className='flex items-center'>
                    {/* Close button */}
                    <button
                        className='md:hidden text-primary hover:text-slate-500 mr-4'
                        onClick={() => setMsgSidebarOpen(!msgSidebarOpen)}
                        aria-controls='messages-sidebar'
                        aria-expanded={msgSidebarOpen}
                    >
                        <span className='sr-only'>Close sidebar</span>
                        <svg className='w-6 h-6 fill-current' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z' />
                        </svg>
                    </button>
                    {/* People list */}
                    <div className='flex -space-x-3 -ml-px relative'>
                        <a className='z-30' href='#0'>
                            {authenticatedUser.avatar ? (
                                <img
                                    className='rounded-full max-w-10 max-h-10 w-10 h-10 object-cover shadow-lg border-4 border-white z-30'
                                    src={authenticatedUser.avatar}
                                    width='32'
                                    height='32'
                                    alt='User 04'
                                />
                            ) : (
                                <Avvvatars value={`${authenticatedUser.firstName} ${authenticatedUser.lastName}`} />
                            )}
                        </a>
                        <a className='z-40' href='#0'>
                            {selectedConversation.userAvatar ? (
                                <img
                                    className='bg-black rounded-full max-w-10 max-h-10 w-10 h-10 object-cover shadow-lg border-4 border-white z-40'
                                    src={selectedConversation.userAvatar}
                                    width='32'
                                    height='32'
                                    alt='User 01'
                                />
                            ) : (
                                <Avvvatars value={`${selectedConversation.userFirstName} ${selectedConversation.userLastName}`} />
                            )}
                        </a>
                    </div>
                </div>
                {/* Buttons on the right side */}
                <div className='flex'>
                    <ModalBasic id='basic-modal' modalOpen={basicModalOpen} setModalOpen={setBasicModalOpen} title='New Conversation'>
                        {/* Modal content */}
                        <div className='px-5 pt-4 pb-1'>
                            <DirectMessages msgSidebarOpen={msgSidebarOpen} setMsgSidebarOpen={setMsgSidebarOpen} />
                        </div>
                        {/* Modal footer */}
                        <div className='px-5 py-4'>
                            <div className='flex flex-wrap justify-end space-x-2'>
                                <button
                                    className='btn-sm border-slate-200 hover:border-slate-300 text-slate-600'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBasicModalOpen(false);
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    className='btn-sm bg-indigo-500 hover:bg-indigo-600 text-white'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBasicModalOpen(false);
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </ModalBasic>
                </div>
            </div>
        </div>
    );
}

export default MessagesHeader;
