import React from 'react';
import DirectMessages from './DirectMessages';
import { Plus } from 'iconoir-react';
import Avvvatars from 'avvvatars-react';
import { useAtom, useAtomValue } from 'jotai';
import { searchAtom, usersAtom } from '../../pages/Messages';

function MessagesSidebar({ msgSidebarOpen, setMsgSidebarOpen, createConversation }) {
  const [search, setSearch] = useAtom(searchAtom);
  const users = useAtomValue(usersAtom);

    return (
        <div
            id='messages-sidebar'
            className={`absolute z-20 top-0 bottom-0 w-full md:w-auto md:static md:top-auto md:bottom-auto -mr-px md:translate-x-0 transition-transform duration-200 ease-in-out ${
                msgSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className='sticky top-0 bg-background overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 md:w-72 xl:w-80 h-[calc(100vh-64px)]'>
                {/* #Marketing group */}
                <div>
                    {/* Group body */}
                    <div className='px-5 py-4'>
                        <div className='flex flex-row w-full items-start'>
                            <form className='relative w-full'>
                                <label htmlFor='msg-search' className='sr-only'>
                                    Search
                                </label>
                                <input
                                    id='msg-search'
                                    className='form-input rounded-full border-none bg-hover text-secondary placeholder-secondary w-full pl-9 focus:border-slate-300'
                                    type='search'
                                    placeholder='Search…'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className='absolute inset-0 right-auto group' type='submit' aria-label='Search'>
                                    <svg
                                        className='w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2'
                                        viewBox='0 0 16 16'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path d='M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z' />
                                        <path d='M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z' />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        {search.length > 0 && (
                            <div className='mt-4'>
                                <ul className='mb-6'>
                                    {users
                                        .filter((user) => {
                                            if (
                                                user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                                                user.lastName.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return user;
                                            }
                                        })
                                        .map((user) => (
                                            <li className='-mx-2'>
                                                <button
                                                    className='flex items-center justify-between w-full p-2 rounded-xl hover:bg-hover focus:outline-none focus:bg-gradient-to-r from-fuchsia-600 to-pink-600 transition duration-150 ease-in-out'
                                                    onClick={() => createConversation(user)}
                                                >
                                                    <div className='flex items-center truncate space-x-2'>
                                                        {user.avatar ? (
                                                            <img
                                                                className='w-8 h-8 rounded-full'
                                                                src={user.avatar}
                                                                width='32'
                                                                height='32'
                                                                alt='User 01'
                                                            />
                                                        ) : (
                                                            <Avvvatars value={`${user.firstName} ${user.lastName}`} />
                                                        )}

                                                        <div className='truncate'>
                                                            <span className='text-sm font-medium text-primary'>
                                                                {user.firstName} {user.lastName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                        {/* Direct messages */}
                        <DirectMessages
                            msgSidebarOpen={msgSidebarOpen}
                            setMsgSidebarOpen={setMsgSidebarOpen}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesSidebar;
