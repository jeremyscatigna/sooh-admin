import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';

import UserAvatar from '../images/user-avatar-32.png';
import { signOut } from 'firebase/auth';
import { useAtomValue } from 'jotai';
import { currentUser } from '../pages/Signup';
import Avvvatars from 'avvvatars-react';

function DropdownLinks({ align }) {
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
                <svg
                    width='24px'
                    height='24px'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    color='#ffffff'
                    strokeWidth='1.5'
                >
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 10.75C12.4142 10.75 12.75 11.0858 12.75 11.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V11.5C11.25 11.0858 11.5858 10.75 12 10.75ZM12.5675 8.00075C12.8446 7.69287 12.8196 7.21865 12.5117 6.94156C12.2038 6.66446 11.7296 6.68942 11.4525 6.99731L11.4425 7.00842C11.1654 7.3163 11.1904 7.79052 11.4983 8.06761C11.8062 8.34471 12.2804 8.31975 12.5575 8.01186L12.5675 8.00075Z'
                        fill='#ffffff'
                    ></path>
                </svg>
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
                                to='https://jelly-apartment-183.notion.site/CGV-CGU-fac0db0184d84e178f7d707a5c4025f5'
                                onClick={() => {
                                    setDropdownOpen(!dropdownOpen);
                                }}
                            >
                                CGU / CGV
                            </Link>
                            <Link
                                className='font-medium text-sm text-primary hover:text-secondary flex items-center py-1 px-3'
                                to='https://www.notion.so/Politique-de-confidentialit-Sooh-aebe324a56e345a88b2ee1343d1ecec5?pvs=4'
                                onClick={() => {
                                    setDropdownOpen(!dropdownOpen);
                                }}
                            >
                                Politique de confidentialité
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>
    );
}

export default DropdownLinks;
