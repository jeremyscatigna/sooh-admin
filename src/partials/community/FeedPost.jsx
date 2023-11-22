import React from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Heart, SendDiagonal } from 'iconoir-react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { currentUser } from '../../pages/Signup';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../main';
import Avvvatars from 'avvvatars-react';

const getLocaleDateTime = () => {
    let d = new Date();
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -5);
    return dateTimeLocalValue;
};

function FeedPost({ item }) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

    const user = useAtomValue(currentUser);

    const [like, setLike] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [seeComments, setSeeComments] = React.useState(false);

    const handleUpdate = async (e, post) => {
        e.preventDefault();
        const commentObject = {
            id: uuidv4(),
            text: comment,
            userId: user.uid,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            userAvatar: user.avatar,
            timestamp: getLocaleDateTime(),
        };

        const updatedComments = [...post.comments, commentObject];
        setSeeComments(true);
        const convcollref = doc(db, 'posts', post.id);

        // Update the Firestore document with the new comments array
        updateDoc(convcollref, {
            comments: updatedComments,
        });

        setComment('');
    };

    return (
        <div key={item.uid} className='bg-card shadow-md rounded-xl p-5'>
            {/* Header */}
            <header className='flex justify-between items-start space-x-3 mb-3'>
                {/* User */}
                <div className='flex items-start space-x-3'>
                    {item.userAvatar ? (
                        <img
                            className='rounded-full shrink-0 object-fit w-10 h-10'
                            src={item.userAvatar}
                            width='40'
                            height='40'
                            alt='User 08'
                        />
                    ) : (
                        <Avvvatars value={`${item.userFirstName} ${item.userLastName}`} />
                    )}

                    <div>
                        <div className='leading-tight'>
                            <Link className='text-sm font-semibold text-primary' to={`profile/${item.userId}`}>
                                {item.userFirstName} {item.userLastName}
                            </Link>
                        </div>
                        <div className='text-xs text-secondary'>Il y a {dayjs(item.date).fromNow(true)}</div>
                    </div>
                </div>
                {/* Menu button */}
                {/* <EditMenu align='right' className='relative inline-flex shrink-0'>
                    <li>
                        <Link className='font-medium text-sm text-primary hover:text-slate-800 flex py-1 px-3' to='#0'>
                            Option 1
                        </Link>
                    </li>
                    <li>
                        <Link className='font-medium text-sm text-primary hover:text-slate-800 flex py-1 px-3' to='#0'>
                            Option 2
                        </Link>
                    </li>
                    <li>
                        <Link className='font-medium text-sm text-primary hover:text-rose-600 flex py-1 px-3' to='#0'>
                            Remove
                        </Link>
                    </li>
                </EditMenu> */}
            </header>
            {/* Body */}
            <div className='text-sm text-primary space-y-2 mb-5'>
                <p>{item.text}</p>
                {item.imageUrl && (
                    <div className='relative flex items-center justify-center !my-4'>
                        <video
                            className='block w-full'
                            width='590'
                            height='332'
                            poster={item.imageUrl}
                            src={item.imageUrl}
                            muted
                            autoPlay
                            loop
                        ></video>
                    </div>
                )}
            </div>
            {/* Footer */}
            <footer className='flex items-center space-x-4'>
                {/* Like button */}
                <button className={`flex items-center text-secondary`} onClick={() => setLike(!like)}>
                    <Heart className={`w-4 h-4 shrink-0 fill-current mr-1.5 ${like && 'text-pink-500'}`} />
                    <div className={`text-sm ${like ? 'text-pink-500' : 'text-secondary'}`}>2.2K</div>
                </button>
                {/* Share button */}
                {/* <button className='flex items-center text-secondary hover:text-indigo-500'>
                    <svg className='w-4 h-4 shrink-0 fill-current mr-1.5' viewBox='0 0 16 16'>
                        <path d='M13 7h2v6a1 1 0 0 1-1 1H4v2l-4-3 4-3v2h9V7ZM3 9H1V3a1 1 0 0 1 1-1h10V0l4 3-4 3V4H3v5Z' />
                    </svg>
                    <div className='text-sm text-secondary'>4.3K</div>
                </button> */}
                {/* Replies button */}
                <button className='flex items-center text-secondary hover:text-pink-500' onClick={() => setSeeComments(!seeComments)}>
                    <svg className='w-4 h-4 shrink-0 fill-current mr-1.5' viewBox='0 0 16 16'>
                        <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                    </svg>
                    <div className='text-sm text-secondary'>{(item.comments && item.comments.length) || 0}</div>
                </button>
            </footer>
            {seeComments && (
                <div className='mt-5 mb-5 pt-3'>
                    <ul className='space-y-2 mb-3'>
                        {item.comments.map((comment) => (
                            <li className='p-3 bg-hover rounded-xl'>
                                <div className='flex items-center space-x-3'>
                                    {comment.userAvatar ? (
                                        <img
                                            className='rounded-full shrink-0 object-fit w-10 h-10'
                                            src={comment.userAvatar}
                                            width='32'
                                            height='32'
                                            alt='User 04'
                                        />
                                    ) : (
                                        <Avvvatars value={`${comment.userFirstName} ${comment.userLastName}`} />
                                    )}
                                    <div>
                                        <div className='text-xs text-white'>
                                            <a className='font-semibold text-white' href='#0'>
                                                {comment.userFirstName} {comment.userLastName}
                                            </a>{' '}
                                            <span className='text-secondary'>Il y a {dayjs(comment.timestamp).fromNow(true)}</span>
                                        </div>
                                        <div className='text-sm'>{comment.text}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className='flex items-center space-x-3 mt-3'>
                {item.userAvatar ? (
                    <img className='rounded-full shrink-0 w-8 h-8 object-fit' src={item.userAvatar} width='32' height='32' alt='User 02' />
                ) : (
                    <Avvvatars value={`${item.userFirstName} ${item.userLastName}`} />
                )}

                <div className='flex w-full'>
                    <label htmlFor='comment-form' className='sr-only text-primary'>
                        Écrire un commentaire…
                    </label>
                    <input
                        id='comment-form'
                        className='form-input border-0 w-full bg-hover text-primary rounded-full placeholder-secondary'
                        type='text'
                        placeholder='Écrire un commentaire…'
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                        }}
                    />
                    <button
                        className='ml-4 btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-lg'
                        onClick={(e) => {
                            handleUpdate(e, item);
                        }}
                    >
                        <SendDiagonal className='text-white' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeedPost;
