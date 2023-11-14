import React from 'react';

function PaginationNumeric() {
  return (
    <div className="flex justify-center">
      <nav className="flex" role="navigation" aria-label="Navigation">
        <div className="mr-2">
          <span className="inline-flex items-center justify-center rounded-xl leading-5 px-2.5 py-2 bg-card text-primary">
            <span className="sr-only">Previous</span><wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
            </svg>
          </span>
        </div>
        <ul className="inline-flex text-sm font-medium -space-x-px shadow-sm">
          <li>
            <span className="inline-flex items-center justify-center rounded-l-xl leading-5 px-3.5 py-2 bg-card text-primary">1</span>
          </li>
          <li>
            <a className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-card hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary" href="#0">2</a>
          </li>
          <li>
            <a className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-card hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary" href="#0">3</a>
          </li>
          <li>
            <span className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-card text-primary">…</span>
          </li>
          <li>
            <a className="inline-flex items-center justify-center rounded-r-xl leading-5 px-3.5 py-2 bg-card hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary" href="#0">9</a>
          </li>
        </ul>
        <div className="ml-2">
          <a href="#0" className="inline-flex items-center justify-center rounded-xl leading-5 px-2.5 py-2 bg-card hover:bg-gradient-to-r from-fuchsia-600 to-pink-600 text-primary shadow-sm">
            <span className="sr-only">Next</span><wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
            </svg>
          </a>
        </div>
      </nav>
    </div>
  );
}

export default PaginationNumeric;
