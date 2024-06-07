import React from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';
import FeedPost from './FeedPost';

function FeedPosts({ posts, handleBlockUser}) {
    dayjs.extend(LocalizedFormat);
    dayjs.extend(RelativeTime);

    return (
        <>
            {posts.map((item, i) => (
                <FeedPost key={i} item={item} handleBlockUser={handleBlockUser} />
            ))}
        </>
    );
}

export default FeedPosts;
