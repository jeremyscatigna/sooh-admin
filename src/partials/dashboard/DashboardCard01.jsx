import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../../components/DropdownEditMenu';

function DashboardCard01({ daily }) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl">
      <div className="px-4 pt-4 flex justify-between">
        
        <div className='flex flex-col items-start justify-center'>

        <h2 className="text-sm font-semibold text-primary">Happy Hours</h2>
        <div className="text-xs font-semibold text-secondary mb-1">Daily</div>
        </div>
        <div className="flex items-center justify-center pb-4">
          <div className="text-5xl font-bold text-primary mr-2 mt-4">{daily}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
