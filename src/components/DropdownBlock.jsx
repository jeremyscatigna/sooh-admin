import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

import UserAvatar from '../images/user-avatar-32.png';
import { signOut } from 'firebase/auth';
import { useAtomValue } from 'jotai';
import { currentUser } from '../pages/Signup';
import Avvvatars from 'avvvatars-react';
import { XCircleIcon } from '@heroicons/react/20/solid';

function DropdownBlock({ align, blockedUsers, handleUnblockUser }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    const user = useAtomValue(currentUser);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <div className='relative inline-flex'>
            <button
                ref={trigger}
                className='inline-flex justify-center items-center group'
                aria-haspopup='true'
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
            >
                <XCircleIcon className='w-8 h-8 text-red-500 hover:text-red-600' />
            </button>

            <Transition
                className={`origin-top-right z-10 absolute top-full min-w-44 bg-hover py-1.5 rounded-xl shadow-lg overflow-hidden mt-1 ${
                    align === 'right' ? 'right-0' : 'left-0'
                }`}
                show={dropdownOpen}
                enter='transition ease-out duration-200 transform'
                enterStart='opacity-0 -translate-y-2'
                enterEnd='opacity-100 translate-y-0'
                leave='transition ease-out duration-200'
                leaveStart='opacity-100'
                leaveEnd='opacity-0'
            >
                <div ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)}>
                    <ul>
                        {blockedUsers.map((user, i) => (
                            <li key={i} className='flex items-center justify-between px-3 py-2'>
                                <div className='flex items-center space-x-2'>
                                    
                                    <div>
                                        <h3 className='text-sm font-medium'>{user.username}</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        handleUnblockUser(user.userId)

                                        setDropdownOpen(false)
                                    }}
                                    className='text-xs text-red-500 hover:text-red-600'
                                >
                                    Debloquer
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Transition>
        </div>
    );
}

export default DropdownBlock;
