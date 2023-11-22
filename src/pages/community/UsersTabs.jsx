import React, { useEffect, useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import UsersTabsCard from '../../partials/community/UsersTabsCard';
import PaginationNumeric from '../../components/PaginationNumeric';

import Image01 from '../../images/user-64-01.jpg';
import Image02 from '../../images/user-64-02.jpg';
import Image03 from '../../images/user-64-03.jpg';
import Image04 from '../../images/user-64-04.jpg';
import Image05 from '../../images/user-64-05.jpg';
import Image06 from '../../images/user-64-06.jpg';
import Image07 from '../../images/user-64-07.jpg';
import Image08 from '../../images/user-64-08.jpg';
import Image09 from '../../images/user-64-09.jpg';
import Image10 from '../../images/user-64-10.jpg';
import Image11 from '../../images/user-64-11.jpg';
import Image12 from '../../images/user-64-12.jpg';

function UsersTabs() {

  const items = [
    {
      id: 0,
      name: 'Dominik McNeail',
      image: Image01,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 1,
      name: 'Ivan Mesaros',
      image: Image02,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 2,
      name: 'Tisha Yanchev',
      image: Image03,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 3,
      name: 'Sergio Gonnelli',
      image: Image04,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 4,
      name: 'Jerzy Wierzy',
      image: Image05,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 5,
      name: 'Mirko Grubisic',
      image: Image06,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 6,
      name: 'Alisha Acharya',
      image: Image07,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 7,
      name: 'Brian Halligan',
      image: Image08,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 8,
      name: 'Patricia Semklo',
      image: Image09,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 9,
      name: 'Maria Martinez',
      image: Image10,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 10,
      name: 'Vedad Siljak',
      image: Image11,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
    {
      id: 11,
      name: 'Dominik Lamakani',
      image: Image12,
      link: '/community/profile',
      location: 'Nice, France',
      content: 'Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP Lover.',
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth <= 500);

    const handleWindowSizeChange = () => {
        setMobile(window.innerWidth <= 500);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      {!mobile && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Content area */} 
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        {!mobile && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Search form */}
                <SearchForm />
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {
                items.map(item => {
                  return (
                    <UsersTabsCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      link={item.link}
                      location={item.location}
                      content={item.content}
                    />
                  )
                })
              }
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <PaginationNumeric />
            </div>

          </div>
        </main>

      </div>
      
    </div>
  );
}

export default UsersTabs;