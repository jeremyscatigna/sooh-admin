import React from 'react';

function Datepicker({ align, selectedDates, setSelectedDates }) {
    const options = {
        mode: 'single',
        static: true,
        monthSelectorType: 'static',
        dateFormat: 'M j, Y H:i',
        enableTime: true,
        time_24hr: true,
        defaultDate: new Date().setDate(new Date().getDate()),
        prevArrow:
            '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
            '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onReady: (selectedDates, dateStr, instance) => {
            instance.element.value = dateStr.replace('to', '-');
            const customClass = align ? align : '';
            instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
        },
        onChange: (selectedDates, dateStr, instance) => {
            instance.element.value = dateStr.replace('to', '-');
        },
    };

    return (
        <div className='relative'>
            <input
                type='datetime-local'
                id='meeting-time'
                name='meeting-time'
                className='form-input rounded-xl border-none bg-hover text-secondary font-medium w-60'
                value={selectedDates}
                onChange={setSelectedDates}
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
