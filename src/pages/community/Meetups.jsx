import React, { useState } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SearchForm from '../../partials/actions/SearchForm';
import MeetupsPosts from '../../partials/community/MeetupsPosts';
import PaginationNumeric from '../../components/PaginationNumeric';
import ModalBasic from '../../components/ModalBasic';
import Datepicker from '../../components/Datepicker';

function Meetups() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([new Date().setDate(new Date().getDate() - 6), new Date()]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');

    const handleCreate = () => {
        console.log('Create');
        console.log(name);
        console.log(description);
        console.log(details);
        console.log(selectedDates);
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                        {/* Page header */}
                        <div className='sm:flex sm:justify-between sm:items-center mb-5'>
                            {/* Left: Title */}
                            <div className='mb-4 sm:mb-0'>
                                <h1 className='text-2xl md:text-3xl text-slate-800 font-bold'>Happy Hours ✨</h1>
                            </div>

                            {/* Right: Actions */}
                            <div className='grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2'>
                                {/* Search form */}
                                <SearchForm placeholder='Search…' />

                                {/* Add meetup button */}
                                <button
                                    className='btn bg-indigo-500 hover:bg-indigo-600 text-white'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCreateModalOpen(true);
                                    }}
                                >
                                    <svg className='w-4 h-4 fill-current opacity-50 shrink-0' viewBox='0 0 16 16'>
                                        <path d='M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z' />
                                    </svg>
                                    <span className='hidden xs:block ml-2'>Add Happy Hour</span>
                                </button>

                                <ModalBasic
                                    id='basic-modal'
                                    modalOpen={createModalOpen}
                                    setModalOpen={setCreateModalOpen}
                                    title='Create your Happy Hour'
                                >
                                    {/* Modal content */}
                                    <div className='px-5 pt-4 pb-1 space-y-4'>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Date
                                            </label>
                                            <Datepicker selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Name
                                            </label>
                                            <input
                                                id='placeholder'
                                                className='form-input w-full'
                                                type='text'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder='Add the name of your Happy Hour'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Description
                                            </label>
                                            <input
                                                id='placeholder'
                                                className='form-input w-full'
                                                type='text'
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder='Add a short description'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium mb-1' htmlFor='placeholder'>
                                                Details
                                            </label>
                                            <textarea
                                                id='placeholder'
                                                className='form-input w-full'
                                                type='text'
                                                rows={5}
                                                value={details}
                                                onChange={(e) => setDetails(e.target.value)}
                                                placeholder='Add as much details as possible'
                                            />
                                        </div>
                                    </div>
                                    {/* Modal footer */}
                                    <div className='px-5 py-4'>
                                        <div className='flex flex-wrap justify-end space-x-2'>
                                            <button
                                                className='btn-sm border-slate-200 hover:border-slate-300 text-slate-600'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCreateModalOpen(false);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button 
                                              className='btn-sm bg-indigo-500 hover:bg-indigo-600 text-white'
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCreate();
                                                setCreateModalOpen(false);
                                              }}
                                            >
                                              Create
                                            </button>
                                        </div>
                                    </div>
                                </ModalBasic>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className='mb-5'>
                            <ul className='flex flex-wrap -m-1'>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out'>
                                        View All
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Online
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Local
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        This Week
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        This Month
                                    </button>
                                </li>
                                <li className='m-1'>
                                    <button className='inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out'>
                                        Following
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className='text-sm text-slate-500 italic mb-4'>289 Happy Hours</div>

                        {/* Content */}
                        <MeetupsPosts />

                        {/* Pagination */}
                        <div className='mt-8'>
                            <PaginationNumeric />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Meetups;
