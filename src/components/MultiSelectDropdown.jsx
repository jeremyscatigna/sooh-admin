import { ArrowDown, NavArrowDown } from 'iconoir-react';
import { useState, useEffect, useRef } from 'react';

export default function MultiSelectDropdown({ formFieldName, options, onChange, prompt = 'Select one or more options' }) {
    const [isJsEnabled, setIsJsEnabled] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const optionsListRef = useRef(null);

    useEffect(() => {
        setIsJsEnabled(true);
    }, []);

    const handleChange = (e) => {
        const isChecked = e.target.checked;
        const option = e.target.value;

        const selectedOptionSet = new Set(selectedOptions);

        if (isChecked) {
            selectedOptionSet.add(option);
        } else {
            selectedOptionSet.delete(option);
        }

        const newSelectedOptions = Array.from(selectedOptionSet);

        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions);
    };

    const isSelectAllEnabled = selectedOptions.length < options.length;

    const handleSelectAllClick = (e) => {
        e.preventDefault();

        const optionsInputs = optionsListRef.current.querySelectorAll('input');
        optionsInputs.forEach((input) => {
            input.checked = true;
        });

        setSelectedOptions([...options]);
        onChange([...options]);
    };

    const isClearSelectionEnabled = selectedOptions.length > 0;

    const handleClearSelectionClick = (e) => {
        e.preventDefault();

        const optionsInputs = optionsListRef.current.querySelectorAll('input');
        optionsInputs.forEach((input) => {
            input.checked = false;
        });

        setSelectedOptions([]);
        onChange([]);
    };

    return (
        <label className='relative'>
            <input type='checkbox' className='hidden peer' />

            <div className='cursor-pointer text-secondary after:text-xs after:ml-1 after:inline-flex after:items-center peer-checked:after:-rotate-180 after:transition-transform inline-flex rounded-xl bg-hover px-8 py-2'>
                {prompt}
                {isJsEnabled && selectedOptions.length > 0 && (
                    <span className='ml-1 text-rose-500'>{`(${selectedOptions.length} sélectionnés)`}</span>
                )}
                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pl-4 pointer-events-none'>
                    <NavArrowDown/>
                </span>
            </div>

            <div className='absolute bg-hover rounded-xl border border-card transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto w-full max-h-60 overflow-y-scroll py-2'>
                <ul ref={optionsListRef}>
                    {options.map((option, i) => {
                        return (
                            <li key={option}>
                                <label className={`flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors`}>
                                    <input
                                        type='checkbox'
                                        name={formFieldName}
                                        value={option}
                                        className='cursor-pointer rounded-sm text-rose-500 bg-hover disabled:opacity-50'
                                        onChange={handleChange}
                                    />
                                    <span className='ml-1'>{option}</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </label>
    );
}
