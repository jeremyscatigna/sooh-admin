import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/icon-03.svg';
import EditMenu from '../../components/DropdownEditMenu';

function DashboardCardComments({ comments }) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-card shadow-lg rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 03" />
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-primary hover:text-slate-800 flex py-1 px-3" to="#0">Option 1</Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-primary hover:text-slate-800 flex py-1 px-3" to="#0">Option 2</Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3" to="#0">Remove</Link>
            </li>
          </EditMenu>
        </header>
        <h2 className="text-lg font-semibold text-primary mb-2">Feed</h2>
        <div className="text-xs font-semibold text-secondary uppercase mb-1">Nombre de commentaires</div>
        <div className="flex items-center justify-center">
          <div className="text-8xl font-bold text-primary mr-2">{comments}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCardComments;
