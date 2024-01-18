import React from 'react';
import { useAtomValue } from 'jotai';
import DashboardAdmin from './DashboardAdmin';
import DashboardPro from './DashboardPro';
import DashboardInflu from './DashboardInflu';
import { currentUser } from './Signup';

function Dashboard() {
    const user = useAtomValue(currentUser);
    console.log(user);

    if(user.admin && user.admin === true) {
        return <DashboardAdmin />
    } else if(user.type === "business") {
        return <DashboardPro />
    } else if(user.type === "influencer") {
        return <DashboardInflu />
    } else {
        return null
    }
}

export default Dashboard;
