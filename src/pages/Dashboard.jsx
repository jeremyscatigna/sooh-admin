import React from 'react';
import { useAtomValue } from 'jotai';
import DashboardAdmin from './DashboardAdmin';
import DashboardPro from './DashboardPro';
import DashboardInflu from './DashboardInflu';
import { currentUser } from './Signup';

function Dashboard() {
    const user = useAtomValue(currentUser);
    console.log(user);

    if (user.admin && user.admin === true) {
        return <DashboardAdmin />;
    } else if (user.type === 'business') {
        return <DashboardPro />;
    } else if (user.type === 'influencer') {
        return <DashboardInflu />;
    } else {
        return (
            <div className='h-screen w-full flex justify-center items-center text-xl font-bold p-8'>
                Cette fonctionnalité est réservée aux professionnels et influenceurs.
            </div>
        );
    }
}

export default Dashboard;
