import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditMenu from '../../components/DropdownEditMenu';

import UserImage02 from '../../images/user-40-02.jpg';
import UserImage08 from '../../images/user-40-08.jpg';
import CommenterImage04 from '../../images/user-32-04.jpg';
import CommenterImage05 from '../../images/user-32-05.jpg';
import * as dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { SendDiagonal } from 'iconoir-react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { currentUser } from '../../pages/Signup';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../main';
import Avvvatars from 'avvvatars-react';

function FeedPosts({ posts }) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

    const user = useAtomValue(currentUser);

    const [like, setLike] = React.useState(false);
    const [share, setShare] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [seeComments, setSeeComments] = React.useState(false);

    useEffect(() => {
        const addComments = async () => {
            await Promise.all(
                posts.map(async (post) => {
                    const res = await getDocs(collection(db, `posts/${post.uid}/comments`));
                    const comments = res.docs.map((doc) => doc.data());
                    console.log(comments);
                    post.comments.push(...comments);
                }),
            );
        };

        addComments();
    }, [posts]);

    const createComment = async (postId) => {
        try {
            await addDoc(collection(db, `posts/${postId}/comments`), {
                uid: uuidv4(),
                text: comment,
                userId: user.uid,
                userFirstName: user.firstName,
                userLastName: user.lastName,
                userAvatar: user.avatar,
            });
        } catch (error) {
            console.log(error);
        }

        setComment('');
    };

    return (
        <>
            {posts.map((item, i) => (
                <div key={item.uid} className='bg-white shadow-md rounded border border-slate-200 p-5'>
                    {/* Header */}
                    <header className='flex justify-between items-start space-x-3 mb-3'>
                        {/* User */}
                        <div className='flex items-start space-x-3'>
                            {item.userAvatar ? (
                                <img className='rounded-full shrink-0' src={item.userAvatar} width='40' height='40' alt='User 08' />
                            ) : (
                                <Avvvatars value={`${item.userFirstName} ${item.userLastName}`} />
                            )}

                            <div>
                                <div className='leading-tight'>
                                    <Link className='text-sm font-semibold text-slate-800' to={`profile/${item.userId}`}>
                                        {item.userFirstName} {item.userLastName}
                                    </Link>
                                </div>
                                <div className='text-xs text-slate-500'>{dayjs(item.date).fromNow(true)} ago</div>
                            </div>
                        </div>
                        {/* Menu button */}
                        <EditMenu align='right' className='relative inline-flex shrink-0'>
                            <li>
                                <Link className='font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3' to='#0'>
                                    Option 1
                                </Link>
                            </li>
                            <li>
                                <Link className='font-medium text-sm text-slate-600 hover:text-slate-800 flex py-1 px-3' to='#0'>
                                    Option 2
                                </Link>
                            </li>
                            <li>
                                <Link className='font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3' to='#0'>
                                    Remove
                                </Link>
                            </li>
                        </EditMenu>
                    </header>
                    {/* Body */}
                    <div className='text-sm text-slate-800 space-y-2 mb-5'>
                        <p>{item.text}</p>
                        <div className='relative flex items-center justify-center !my-4'>
                            <img className='block w-full' src={item.imageUrl} width='590' height='332' alt='Feed 01' />
                        </div>
                    </div>
                    {/* Footer */}
                    <footer className='flex items-center space-x-4'>
                        {/* Like button */}
                        <button
                            className={`flex items-center ${like ? 'text-indigo-400' : 'text-slate-400'}`}
                            onClick={() => setLike(!like)}
                        >
                            <svg className='w-4 h-4 shrink-0 fill-current mr-1.5' viewBox='0 0 16 16'>
                                <path d='M14.682 2.318A4.485 4.485 0 0011.5 1 4.377 4.377 0 008 2.707 4.383 4.383 0 004.5 1a4.5 4.5 0 00-3.182 7.682L8 15l6.682-6.318a4.5 4.5 0 000-6.364zm-1.4 4.933L8 12.247l-5.285-5A2.5 2.5 0 014.5 3c1.437 0 2.312.681 3.5 2.625C9.187 3.681 10.062 3 11.5 3a2.5 2.5 0 011.785 4.251h-.003z' />
                            </svg>
                            <div className={`text-sm ${like ? 'text-indigo-500' : 'text-slate-500'}`}>2.2K</div>
                        </button>
                        {/* Share button */}
                        <button className='flex items-center text-slate-400 hover:text-indigo-500'>
                            <svg className='w-4 h-4 shrink-0 fill-current mr-1.5' viewBox='0 0 16 16'>
                                <path d='M13 7h2v6a1 1 0 0 1-1 1H4v2l-4-3 4-3v2h9V7ZM3 9H1V3a1 1 0 0 1 1-1h10V0l4 3-4 3V4H3v5Z' />
                            </svg>
                            <div className='text-sm text-slate-500'>4.3K</div>
                        </button>
                        {/* Replies button */}
                        <button
                            className='flex items-center text-slate-400 hover:text-indigo-500'
                            onClick={() => setSeeComments(!seeComments)}
                        >
                            <svg className='w-4 h-4 shrink-0 fill-current mr-1.5' viewBox='0 0 16 16'>
                                <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z' />
                            </svg>
                        </button>
                    </footer>
                    {seeComments && (
                        <div className='mt-5 pt-3 border-t border-slate-200'>
                            <ul className='space-y-2 mb-3'>
                                {item.comments.map((comment) => (
                                    <li className='p-3 bg-slate-50 rounded'>
                                        <div className='flex items-start space-x-3'>
                                            {comment.userAvatar ? (
                                                <img
                                                    className='rounded-full shrink-0'
                                                    src={comment.userAvatar}
                                                    width='32'
                                                    height='32'
                                                    alt='User 04'
                                                />
                                            ) : (
                                                <Avvvatars value={`${comment.userFirstName} ${comment.userLastName}`} />
                                            )}
                                            <div>
                                                <div className='text-xs text-slate-500'>
                                                    <a className='font-semibold text-slate-800' href='#0'>
                                                        {comment.userFirstName} {comment.userLastName}
                                                    </a>{' '}
                                                    · 44min
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
                            <img className='rounded-full shrink-0' src={UserImage02} width='32' height='32' alt='User 02' />
                        ) : (
                            <Avvvatars value={`${item.userFirstName} ${item.userLastName}`} />
                        )}

                        <div className='flex w-full'>
                            <label htmlFor='comment-form' className='sr-only'>
                                Écrire un commentaire…
                            </label>
                            <input
                                id='comment-form'
                                className='form-input w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 placeholder-slate-500'
                                type='text'
                                placeholder='Écrire un commentaire…'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button className='btn border-slate-200 hover:border-slate-300 ml-4' onClick={() => createComment(item.uid)}>
                                <SendDiagonal />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default FeedPosts;
