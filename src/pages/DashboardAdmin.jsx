import React, { useEffect, useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import { useAtomValue } from 'jotai';
import { userTypeAtom } from './Onboarding01';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../main';
import { categories } from '../utils/categories';
import { currentUser } from './Signup';

function DashboardAdmin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const [happyHoursData, setHappyHoursData] = useState([]);
    const [happyHoursByRecurency, setHappyHoursByRecurency] = useState([]);
    const [happyHoursByCategory, setHappyHoursByCategory] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [usersByType, setUsersByType] = useState([]);
    const [happyHoursRevenueByCategory, setHappyHoursRevenueByCategory] = useState([]);

    const user = useAtomValue(currentUser);

    const priceDaily = 32.99;
    const priceWeekly = 15.99;
    const priceUnique = 9.99;

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    const matchCategoryRevenueNumberOrZero = () => {
        const matched = [];
        categories.map((category) => {
            matched.push(happyHoursRevenueByCategory[category] || 0);
        });
        return matched;
    }

    const getDailyRevenue = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Daily'] * priceDaily;
    }

    const getWeeklyRevenue = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Weekly'] * priceWeekly;
    }

    const getUniqueRevenue = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Unique'] * priceUnique;
    }

    const getDailyHappyHours = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Daily'] || 0;
    };

    const getWeeklyHappyHours = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Weekly'] || 0;
    };

    const getUniqueHappyHours = (happyHoursByRecurency) => {
        return happyHoursByRecurency['Unique'] || 0;
    };

    const getCategoriesNumber = (happyHoursByCategory) => {
        const matched = [];
        categories.map((category) => {
            matched.push(happyHoursByCategory[category] || 0);
        });
        return matched;
    };

    const getUsersByTypeNumber = (usersByType) => {
        const matched = [];
        const types = ['user', 'business', 'influencer'];
        types.map((category) => {
            matched.push(usersByType[category] || 0);
        });

        console.log(matched);
        return matched;
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        const getHappyHoursByRecurency = (happyHours) => {
            const happyHoursByRecurency = happyHours.reduce((acc, happyHour) => {
                if (acc[happyHour.recurency]) {
                    acc[happyHour.recurency] += 1;
                } else {
                    acc[happyHour.recurency] = 1;
                }
                return acc;
            }, {});

            console.log(happyHoursByRecurency);
            setHappyHoursByRecurency(happyHoursByRecurency);
        };

        const getHappyHoursByCategory = (happyHours) => {
            const happyHoursByCategory = happyHours.reduce((acc, happyHour) => {
                if (acc[happyHour.category]) {
                    acc[happyHour.category] += 1;
                } else {
                    acc[happyHour.category] = 1;
                }
                return acc;
            }, {});

            console.log(happyHoursByCategory);
            setHappyHoursByCategory(happyHoursByCategory);
        };

        const getRevenueByCategory = (happyHours) => {
            const happyHoursByCategory = happyHours.reduce((acc, happyHour) => {
                if (acc[happyHour.category]) {
                    if(happyHour.recurency === 'Daily') {
                        acc[happyHour.category] += priceDaily;
                    } else if(happyHour.recurency === 'Weekly') {
                        acc[happyHour.category] += priceWeekly;
                    } else if(happyHour.recurency === 'Unique') {
                        acc[happyHour.category] += priceUnique;
                    }
                } else {
                    if(happyHour.recurency === 'Daily') {
                        acc[happyHour.category] = priceDaily;
                    } else if(happyHour.recurency === 'Weekly') {
                        acc[happyHour.category] = priceWeekly;
                    } else if(happyHour.recurency === 'Unique') {
                        acc[happyHour.category] = priceUnique;
                    }
                }
                return acc;
            }, {});

            console.log(happyHoursByCategory);
            setHappyHoursRevenueByCategory(happyHoursByCategory);
        }

        const getUsersByType = (users) => {
            const usersByType = users.reduce((acc, user) => {
                if (acc[user.type]) {
                    acc[user.type] += 1;
                } else {
                    acc[user.type] = 1;
                }
                return acc;
            }, {});

            console.log(usersByType);
            setUsersByType(usersByType);
        };

        const fetchData = async () => {
            const res = await getDocs(query(collection(db, 'happyhours')));

            const resUser = await getDocs(query(collection(db, 'users')));

            setHappyHoursData(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setUsersData(resUser.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

            getHappyHoursByRecurency(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            getHappyHoursByCategory(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

            getUsersByType(resUser.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            getRevenueByCategory(res.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchData();
    }, []);

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                        {/* Cards */}
                        <div className='grid grid-cols-12 gap-6'>
                            {/* Line chart (Acme Plus) */}
                            <DashboardCard01 daily={getDailyHappyHours(happyHoursByRecurency)} />
                            {/* Line chart (Acme Advanced) */}
                            <DashboardCard02 weekly={getWeeklyHappyHours(happyHoursByRecurency)} />
                            {/* Line chart (Acme Professional) */}
                            <DashboardCard03 unique={getUniqueHappyHours(happyHoursByRecurency)} />
                            {/* Bar chart (Direct vs Indirect) */}
                            <DashboardCard04 happyHoursByCategory={getCategoriesNumber(happyHoursByCategory)} />
                            {/* Line chart (Real Time Value) */}
                            <DashboardCard05 userByType={getUsersByTypeNumber(usersByType)} />
                            <DashboardCard08 revenueByRecurency={[getDailyRevenue(happyHoursByRecurency), getWeeklyRevenue(happyHoursByRecurency), getUniqueRevenue(happyHoursByRecurency)]} />
                            {/* Stacked bar chart (Sales VS Refunds) */}
                            <DashboardCard09 revenueByCategory={matchCategoryRevenueNumberOrZero()} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardAdmin;
