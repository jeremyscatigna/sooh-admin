import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ProfileBody from '../../partials/community/ProfileBody';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../main';

function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const collectionQuery = query(collection(db, 'users'), where('uid', '==', id));

        onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUser(data[0]);
        });
    }, []);

    useEffect(() => {
        const collectionQuery = query(collection(db, 'posts'), where('userId', '==', id));

        onSnapshot(collectionQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(data);
        });
    }, []);

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white'>
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className='relative flex justify-center items-center'>
                        <ProfileBody user={user} posts={posts} profileSidebarOpen={profileSidebarOpen} setProfileSidebarOpen={setProfileSidebarOpen} />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
