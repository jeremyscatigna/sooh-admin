import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditMenu from '../../components/DropdownEditMenu';

import UserImage02 from '../../images/user-40-02.jpg';
import UserImage08 from '../../images/user-40-08.jpg';
import CommenterImage04 from '../../images/user-32-04.jpg';
import CommenterImage05 from '../../images/user-32-05.jpg';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { SendDiagonal } from 'iconoir-react';
import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { currentUser } from '../../pages/Signup';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../main';
import Avvvatars from 'avvvatars-react';
import FeedPost from './FeedPost';

function FeedPosts({ posts }) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

    const user = useAtomValue(currentUser);

    const [like, setLike] = React.useState(false);
    const [share, setShare] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [seeComments, setSeeComments] = React.useState(false);

    const handleUpdate = async (e, post) => {
        e.preventDefault();
        const comment = {
            id: uuidv4(),
            text: comment,
            userId: user.uid,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            userAvatar: user.avatar,
            timestamp: serverTimestamp(),
        }

        post.comments.push(comment);
        const convcollref = doc(db, 'posts', post.id)
        
        updateDoc(convcollref, {
            comments: [...post.comments, comment],
        });

        setComment('');
    };

    return (
        <>
            {posts.map((item, i) => (
                <FeedPost key={i} item={item} />
            ))}
        </>
    );
}

export default FeedPosts;
