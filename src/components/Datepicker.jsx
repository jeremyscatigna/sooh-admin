import React from 'react';

function Datepicker({ align, selectedDates, setSelectedDates }) {
    console.log(selectedDates)
    return (
        <div className='relative'>
            <input
                type='datetime-local'
                id='meeting-time'
                name='meeting-time'
                className='form-input rounded-xl border-none bg-hover text-secondary font-medium w-60'
                value={selectedDates}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  const dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -5)
                  console.log(dateTimeLocalValue);
                  setSelectedDates(dateTimeLocalValue)
                }}
            />
            {/* <div className='absolute inset-0 right-auto flex items-center pointer-events-none'>
                <svg className='w-4 h-4 fill-current text-secondary ml-3' viewBox='0 0 16 16'>
                    <path d='M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z' />
                </svg>
            </div> */}
        </div>
    );
}

export default Datepicker;
