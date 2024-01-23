import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Heart, SendDiagonal, ShareIos } from 'iconoir-react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
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

const doILikeThisPost = (item, user) => {
    if (item.likes) {
        return item.likes.filter((like) => like.userId === user.uid).length > 0;
    }
    return false;
};

function FeedPost({ item }) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

    const user = useAtomValue(currentUser);

    const [like, setLike] = React.useState(item.likes ? doILikeThisPost(item, user) : false);
    const [comment, setComment] = React.useState('');
    const [seeComments, setSeeComments] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [isUserListVisible, setIsUserListVisible] = React.useState(false);
    const [userListFilter, setUserListFilter] = React.useState('');

    const fetchUser = async () => {
        const res = await getDocs(collection(db, 'users'));

        setUsers(res.docs.map((doc) => doc.data()));
    };

    // Handling comment input changes
    const handleCommentChange = (e) => {
        const value = e.target.value;
        setComment(value);

        // Detect if "@" is present and show user list
        const atIndex = value.lastIndexOf('@');
        fetchUser();
        if (atIndex > -1) {
            setIsUserListVisible(true);
            setUserListFilter(value.substring(atIndex + 1).toLowerCase());
        } else {
            setIsUserListVisible(false);
        }
    };

    // Handling user selection from the list
    const handleUserSelect = (firstName, lastName) => {
        const lastAtIndex = comment.lastIndexOf('@');
        setComment(`${comment.substring(0, lastAtIndex)}@${firstName} ${lastName} `);
        setIsUserListVisible(false);
    };

    useEffect(() => {
        setLike(item.likes ? doILikeThisPost(item, user) : false);
    }, [item]);

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
        item.comments = updatedComments;
        setSeeComments(true);
        const convcollref = doc(db, 'posts', post.id);

        // Update the Firestore document with the new comments array
        updateDoc(convcollref, {
            comments: updatedComments,
        });

        setComment('');
    };

    const handleLikeUpdate = async (e, post) => {
        e.preventDefault();
        const likeObject = {
            id: uuidv4(),
            userId: user.uid,
        };

        let updatedLikes = [];
        if (like) {
            updatedLikes = post.likes.filter((like) => like.userId !== user.uid);
            item.likes = updatedLikes;
            setLike(false);
        } else {
            updatedLikes = [...post.likes, likeObject];
        }
        item.likes = updatedLikes;
        const convcollref = doc(db, 'posts', post.id);

        // Update the Firestore document with the new comments array
        updateDoc(convcollref, {
            likes: updatedLikes,
        });
    };

    const handleShare = async () => {
        const postUrl = `http://yourwebsite.com/posts/${item.uid}`; // Adjust the URL to point to your post detail page
        // Facebook share URL
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;

        // Open a new window for the Facebook share dialog
        window.open(facebookShareUrl, 'facebook-share-dialog', 'width=800,height=600');
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
                            autoPlay
                            playsInline
                            loop
                        ></video>
                    </div>
                )}
            </div>
            {/* Footer */}
            <footer className='flex items-center space-x-4'>
                {/* Like button */}
                <button
                    className={`flex items-center text-secondary`}
                    onClick={(e) => {
                        setLike(!like);
                        handleLikeUpdate(e, item);
                    }}
                >
                    <Heart className={`w-4 h-4 shrink-0 fill-current mr-1.5 ${like && 'text-pink-500'}`} />
                    <div className={`text-sm ${like ? 'text-pink-500' : 'text-secondary'}`}>{item.likes ? item.likes.length : 0}</div>
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
                <button className='flex items-center text-secondary' onClick={handleShare}>
                    {/* Replace with an appropriate share icon */}

                    <ShareIos className='w-5 h-4 shrink-0 font-bold' strokeWidth={3} />
                </button>
            </footer>
            {seeComments && (
                <div className='mt-5 mb-5 pt-3'>
                    <ul className='space-y-2 mb-3'>
                        {item.comments.map((comment) => (
                            <li className='p-3 bg-hover rounded-xl' key={comment.uid}>
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

            <div className='flex flex-col items-center w-full space-x-3 mt-3'>
                <div className='flex items-center space-x-3 w-full mt-3'>
                    {user.avatar ? (
                        <img className='rounded-full shrink-0 w-8 h-8 object-fit' src={user.avatar} width='32' height='32' alt='User 02' />
                    ) : (
                        <Avvvatars value={`${user.firstName} ${user.lastName}`} />
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
                            onChange={handleCommentChange}
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

                {isUserListVisible && (
                    <div className='flex w-full justify-start items-center space-y-2 pt-4'>
                        <ul className='space-y-2 w-full max-h-72 overflow-scroll'>
                            {users
                                .filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(userListFilter))
                                .map((filteredUser) => (
                                    <li
                                        key={filteredUser.id}
                                        onClick={() => handleUserSelect(filteredUser.firstName, filteredUser.lastName)}
                                        className='p-3 bg-hover hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 w-full rounded-xl cursor-pointer'
                                    >
                                        <div className='flex items-center space-x-3'>
                                            {filteredUser.avatar ? (
                                                <img
                                                    className='rounded-full shrink-0 object-fit w-8 h-8'
                                                    src={filteredUser.avatar}
                                                    width='28'
                                                    height='28'
                                                    alt='User 04'
                                                />
                                            ) : (
                                                <Avvvatars value={`${filteredUser.firstName} ${filteredUser.lastName}`} />
                                            )}
                                            <div>
                                                <div className='text-xs text-white'>
                                                    <a className='font-semibold text-white' href='#0'>
                                                        {filteredUser.firstName} {filteredUser.lastName}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeedPost;
