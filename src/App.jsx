import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Fintech from './pages/Fintech';
import Customers from './pages/ecommerce/Customers';
import Orders from './pages/ecommerce/Orders';
import Invoices from './pages/ecommerce/Invoices';
import Shop from './pages/ecommerce/Shop';
import Shop2 from './pages/ecommerce/Shop2';
import Product from './pages/ecommerce/Product';
import Cart from './pages/ecommerce/Cart';
import Cart2 from './pages/ecommerce/Cart2';
import Cart3 from './pages/ecommerce/Cart3';
import Pay from './pages/ecommerce/Pay';
import Campaigns from './pages/Campaigns';
import UsersTabs from './pages/community/UsersTabs';
import Profile from './pages/community/Profile';
import Feed from './pages/community/Feed';
import Meetups from './pages/community/Meetups';
import MeetupsPost from './pages/community/MeetupsPost';
import CreditCards from './pages/finance/CreditCards';
import Transactions from './pages/finance/Transactions';
import TransactionDetails from './pages/finance/TransactionDetails';
import JobListing from './pages/job/JobListing';
import JobPost from './pages/job/JobPost';
import CompanyProfile from './pages/job/CompanyProfile';
import Messages, { msgSidebarOpenAtom } from './pages/Messages';
import TasksKanban from './pages/tasks/TasksKanban';
import TasksList from './pages/tasks/TasksList';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Account from './pages/settings/Account';
import Notifications from './pages/settings/Notifications';
import Apps from './pages/settings/Apps';
import Plans from './pages/settings/Plans';
import Billing from './pages/settings/Billing';
import Feedback from './pages/settings/Feedback';
import Changelog from './pages/utility/Changelog';
import Roadmap from './pages/utility/Roadmap';
import Faqs from './pages/utility/Faqs';
import EmptyState from './pages/utility/EmptyState';
import PageNotFound from './pages/utility/PageNotFound';
import KnowledgeBase from './pages/utility/KnowledgeBase';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Onboarding01 from './pages/Onboarding01';
import Onboarding02 from './pages/Onboarding02';
import Onboarding03 from './pages/Onboarding03';
import Onboarding04 from './pages/Onboarding04';
import ButtonPage from './pages/component/ButtonPage';
import FormPage from './pages/component/FormPage';
import DropdownPage from './pages/component/DropdownPage';
import AlertPage from './pages/component/AlertPage';
import ModalPage from './pages/component/ModalPage';
import PaginationPage from './pages/component/PaginationPage';
import TabsPage from './pages/component/TabsPage';
import BreadcrumbPage from './pages/component/BreadcrumbPage';
import BadgePage from './pages/component/BadgePage';
import AvatarPage from './pages/component/AvatarPage';
import TooltipPage from './pages/component/TooltipPage';
import AccordionPage from './pages/component/AccordionPage';
import IconsPage from './pages/component/IconsPage';

import ProtectedRoute from './utils/ProtectedRoute';
import { SlidingTabBar } from './partials/Tabbar';
import CreateHappyHour from './pages/community/CreateHappyHour';
import { useAtomValue } from 'jotai';
import UpdateHappyHour from './pages/community/UpdateHappyHour';
import ChatPage from './pages/Chat';
import { FCM } from '@capacitor-community/fcm';

import 'stream-chat-react/dist/css/v2/index.css';
import SinglePost from './pages/community/SinglePost';
import { PushNotifications } from '@capacitor/push-notifications';

function App() {
    const location = useLocation();
    const { pathname } = location;
    const [mobile, setMobile] = useState(window.innerWidth <= 500);
    const msgSidebarOpen = useAtomValue(msgSidebarOpenAtom);

    useEffect(() => {
        console.log('Initializing HomePage');

        // Request permission to use push notifications
        const requestPermissions = async () => {
            const result = await PushNotifications.requestPermissions();
            if (result.receive === 'granted') {
                // Register with Apple / Google to receive push via APNS/FCM
                PushNotifications.register();
            } else {
                // Show some error
                console.error('Push notification permission was denied');
            }
        };

        requestPermissions();

        // On success, we should be able to receive notifications
        const onRegistration = (token) => {
            // alert('Push registration success, token: ' + token.value);
        };

        // Some issue with our setup and push will not work
        const onRegistrationError = (error) => {
            alert('Error on registration: ' + JSON.stringify(error));
        };

        // Show us the notification payload if the app is open on our device
        const onPushReceived = (notification) => {
            alert(JSON.stringify(notification));
        };

        // Method called when tapping on a notification
        const onPushActionPerformed = (notification) => {
            console.log('Push action performed: ' + JSON.stringify(notification));
        };

        FCM.subscribeTo({ topic: 'allUsers' })
            .then((r) => console.log('Successfully subscribed to topic:', r))
            .catch((err) => console.log(err));

        // Add listeners
        PushNotifications.addListener('registration', onRegistration);
        PushNotifications.addListener('registrationError', onRegistrationError);
        PushNotifications.addListener('pushNotificationReceived', onPushReceived);
        PushNotifications.addListener('pushNotificationActionPerformed', onPushActionPerformed);

        // Clean up listeners
        return () => {
            PushNotifications.removeListener('registration', onRegistration);
            PushNotifications.removeListener('registrationError', onRegistrationError);
            PushNotifications.removeListener('pushNotificationReceived', onPushReceived);
            PushNotifications.removeListener('pushNotificationActionPerformed', onPushActionPerformed);
        };
    }, []);

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        document.querySelector('html').style.scrollBehavior = 'auto';
        window.scroll({ top: 0 });
        document.querySelector('html').style.scrollBehavior = '';
    }, [location.pathname]); // triggered on route change

    return (
        <>
            <Routes>
                <Route
                    exact
                    path='/'
                    element={
                        <ProtectedRoute>
                            <Feed />
                        </ProtectedRoute>
                    }
                />
                <Route path='/influencers' element={<UsersTabs />} />
                <Route path='/profile/:id' element={<Profile />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/posts/:id' element={<SinglePost />} />
                <Route path='/happyhours' element={<Meetups />} />
                <Route path='/happyhours/new' element={<CreateHappyHour />} />
                <Route path='/happyhours/update/:id' element={<UpdateHappyHour />} />
                <Route path='/happyhours/:id' element={<MeetupsPost />} />
                <Route path='/chat' element={<ChatPage />} />
                <Route path='/community/meetups-post' element={<MeetupsPost />} />
                <Route path='/dashboard/analytics' element={<Analytics />} />
                <Route path='/dashboard/fintech' element={<Fintech />} />
                <Route path='/ecommerce/customers' element={<Customers />} />
                <Route path='/ecommerce/orders' element={<Orders />} />
                <Route path='/ecommerce/invoices' element={<Invoices />} />
                <Route path='/ecommerce/shop' element={<Shop />} />
                <Route path='/ecommerce/shop-2' element={<Shop2 />} />
                <Route path='/ecommerce/product' element={<Product />} />
                <Route path='/ecommerce/cart' element={<Cart />} />
                <Route path='/ecommerce/cart-2' element={<Cart2 />} />
                <Route path='/ecommerce/cart-3' element={<Cart3 />} />
                <Route path='/ecommerce/pay' element={<Pay />} />
                <Route path='/campaigns' element={<Campaigns />} />
                <Route path='/finance/cards' element={<CreditCards />} />
                <Route path='/finance/transactions' element={<Transactions />} />
                <Route path='/finance/transaction-details' element={<TransactionDetails />} />
                <Route path='/job/job-listing' element={<JobListing />} />
                <Route path='/job/job-post' element={<JobPost />} />
                <Route path='/job/company-profile' element={<CompanyProfile />} />
                <Route path='/messages' element={<Messages />} />
                <Route path='/tasks/kanban' element={<TasksKanban />} />
                <Route path='/tasks/list' element={<TasksList />} />
                <Route path='/inbox' element={<Inbox />} />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/settings/account' element={<Account />} />
                <Route path='/settings/notifications' element={<Notifications />} />
                <Route path='/settings/apps' element={<Apps />} />
                <Route path='/settings/plans' element={<Plans />} />
                <Route path='/settings/billing' element={<Billing />} />
                <Route path='/settings/feedback' element={<Feedback />} />
                <Route path='/utility/changelog' element={<Changelog />} />
                <Route path='/utility/roadmap' element={<Roadmap />} />
                <Route path='/utility/faqs' element={<Faqs />} />
                <Route path='/utility/empty-state' element={<EmptyState />} />
                <Route path='/utility/404' element={<PageNotFound />} />
                <Route path='/utility/knowledge-base' element={<KnowledgeBase />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/onboarding-01' element={<Onboarding01 />} />
                <Route path='/onboarding-02' element={<Onboarding02 />} />
                <Route path='/onboarding-03' element={<Onboarding03 />} />
                <Route path='/onboarding-04' element={<Onboarding04 />} />
                <Route path='/component/button' element={<ButtonPage />} />
                <Route path='/component/form' element={<FormPage />} />
                <Route path='/component/dropdown' element={<DropdownPage />} />
                <Route path='/component/alert' element={<AlertPage />} />
                <Route path='/component/modal' element={<ModalPage />} />
                <Route path='/component/pagination' element={<PaginationPage />} />
                <Route path='/component/tabs' element={<TabsPage />} />
                <Route path='/component/breadcrumb' element={<BreadcrumbPage />} />
                <Route path='/component/badge' element={<BadgePage />} />
                <Route path='/component/avatar' element={<AvatarPage />} />
                <Route path='/component/tooltip' element={<TooltipPage />} />
                <Route path='/component/accordion' element={<AccordionPage />} />
                <Route path='/component/icons' element={<IconsPage />} />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
            {mobile &&
                !pathname.includes('signin') &&
                !pathname.includes('signup') &&
                !pathname.includes('onboarding') &&
                msgSidebarOpen === true && <SlidingTabBar />}
        </>
    );
}

export default App;
