import { Channel, ChannelHeader, ChannelList, Chat, LoadingIndicator, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';

import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';

import 'stream-chat-react/dist/css/v2/index.css';
import { useClient } from '../utils/useClient';
import { UserSquare } from 'iconoir-react';
import { useState } from 'react';

init({ data });

const userId = 'solitary-hat-9';
const userName = 'solitary';

const user = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};

const apiKey = 'dz5f4d5kzrue';
const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic29saXRhcnktaGF0LTkiLCJleHAiOjE3MDY3MjU3NDN9.p83IGFusLGzBfm_EgTIWOXdjk1sCHL2O8a0n9Deq17M';

const sort = { last_message_at: -1 };
const filters = {
    type: 'messaging',
    members: { $in: [userId] },
};
const options = {
    limit: 10,
};

const ChatPage = () => {
    const [openCreateConversation, setOpenCreateConversation] = useState(false);
    const chatClient = useClient({
        apiKey,
        user,
        tokenOrProvider: userToken,
    });

    if (!chatClient) {
        return <LoadingIndicator />;
    }

    return (
        <div className='h-screen'>
            <Chat client={chatClient} theme='str-chat__theme-dark'>
                <div className='w-full h-full pt-8 grid grid-cols-8'>
                    <div className='col-span-2 border-r overflow-hidden'>
                        <div className='flex items-center justify-between gap-3 p-3 border-b'>
                            <div className='flex gap-6'>
                                <span>
                                    <UserSquare
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setOpenCreateConversation(true);
                                        }}
                                    />
                                </span>
                            </div>
                        </div>
                        <ChannelList filters={filters} sort={sort} options={options} />
                    </div>
                    <div className='col-span-6 overflow-scroll'>
                        <Channel EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageInput />
                            </Window>
                            <Thread />
                        </Channel>
                    </div>
                </div>
            </Chat>
        </div>
    );
};

export default ChatPage;
