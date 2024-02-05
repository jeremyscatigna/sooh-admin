import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

import UserAvatar from '../images/user-avatar-32.png';
import { signOut } from 'firebase/auth';
import { useAtomValue } from 'jotai';
import { currentUser } from '../pages/Signup';
import Avvvatars from 'avvvatars-react';

function DropdownProfile({ align }) {
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
                {user.avatar ? (
                    <img className='w-8 h-8 rounded-full' src={user.avatar} width='32' height='32' alt='User' />
                ) : (
                    <Avvvatars value={`${user.firstName} ${user.lastName}`} />
                )}

                <div className='flex items-center truncate'>
                    <span className='truncate ml-2 text-sm font-medium group-hover:text-pink-500'>
                        {user.username && user.username !== '' ? user.username : user.firstName + ' ' + user.lastName}
                    </span>
                    <svg className='w-3 h-3 shrink-0 ml-1 fill-current text-slate-400' viewBox='0 0 12 12'>
                        <path d='M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z' />
                    </svg>
                </div>
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
                        <li>
                            <Link
                                className='font-medium text-sm text-primary hover:text-secondary flex items-center py-1 px-3'
                                to='/signin'
                                onClick={() => {
                                    setDropdownOpen(!dropdownOpen);
                                    signOut();
                                }}
                            >
                                Se déconnecter
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>
    );
}

export default DropdownProfile;
