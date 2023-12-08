import React from 'react';
import { Link } from 'react-router-dom';
import EditMenu from '../../components/DropdownEditMenu';
import Avvvatars from 'avvvatars-react';
import { getCategoriesShadowColor } from '../../utils/categories';

function UsersTabsCard(props) {
    console.log(props);
    return (
        <div className={`col-span-full sm:col-span-6 xl:col-span-3 bg-card shadow-lg ${
          props.category ? getCategoriesShadowColor(props.category) : getCategoriesShadowColor('Autre')
      } rounded-xl`}>
            <div className='flex flex-col h-full'>
                {/* Card top */}
                <div className='grow p-5'>
                    {/* Menu button */}
                    {/* Image + name */}
                    <header>
                        <div className='flex justify-center mb-2'>
                            <Link className='relative inline-flex items-start' to={props.link}>
                                {props.image !== '' ? (
                                    <img className='rounded-full' src={props.image} width='64' height='64' alt={props.name} />
                                ) : (
                                    <Avvvatars size={64} value={`${props.name}`} />
                                )}
                            </Link>
                        </div>
                        <div className='text-center'>
                            <Link className='inline-flex text-primary hover:text-pink-500' to={props.link}>
                                <h2 className='text-xl leading-snug justify-center font-semibold'>{props.name}</h2>
                            </Link>
                        </div>
                        <div className='flex justify-center items-center text-sm text-secondary'>{props.location}</div>
                    </header>
                    {/* Bio */}
                    <div className='text-center text-secondary mt-2'>
                        <div className='text-sm'>{props.content}</div>
                    </div>
                </div>
                {/* Card footer */}
                <div className=''>
                    <Link className='block text-center text-sm text-primary hover:text-pink-500 font-medium px-3 py-4' to='/messages'>
                        <div className='flex items-center justify-center'>
                            <svg className='w-4 h-4 fill-current shrink-0 mr-2' viewBox='0 0 16 16'>
                                <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                            </svg>
                            <span>Envoyer un message</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default UsersTabsCard;
