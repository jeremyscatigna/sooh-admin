import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../../components/DropdownEditMenu';

function DashboardCardHappyHours({ happyHours }) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl">
      <div className="px-5 pt-5">
        
        <h2 className="text-lg font-semibold text-primary mb-2">Happy Hours</h2>
        <div className="text-xs font-semibold text-secondary uppercase mb-1">Nombre d&apos;Happy hours</div>
        <div className="flex items-center justify-center pb-12">
          <div className="text-6xl font-bold text-primary mr-2 mt-4">{happyHours}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCardHappyHours;
