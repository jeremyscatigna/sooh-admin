import React from 'react';

function BillingPanel() {
  return (
    <div className="grow">

      {/* Panel body */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl text-slate-800 font-bold mb-4">Facturation</h2>
        </div>

        {/* Billing Information */}
        <section>
         
          <ul>
            <li className="md:flex md:justify-between md:items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div className="text-sm text-slate-800 font-medium">Mode de paiement</div>
              {/* Right */}
              <div className="text-sm text-slate-800ml-4">
                <span className="mr-3">Mastercard ending 9282</span>
                <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Modifier</a>
              </div>
            </li>
            <li className="md:flex md:justify-between md:items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div className="text-sm text-slate-800 font-medium">Intervalle de facturation</div>
              {/* Right */}
              <div className="text-sm text-slate-800ml-4">
                <span className="mr-3">Annuel</span>
                <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Modifier</a>
              </div>
            </li>
            <li className="md:flex md:justify-between md:items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div className="text-sm text-slate-800 font-medium">Numéro de TVA</div>
              {/* Right */}
              <div className="text-sm text-slate-800ml-4">
                <span className="mr-3">UK849700927</span>
                <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Modifier</a>
              </div>
            </li>
            <li className="md:flex md:justify-between md:items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div className="text-sm text-slate-800 font-medium">Addresse</div>
              {/* Right */}
              <div className="text-sm text-slate-800ml-4">
                <span className="mr-3">34 Savoy Street, London, UK, 24E8X</span>
                <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Modifier</a>
              </div>
            </li>
            <li className="md:flex md:justify-between md:items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div className="text-sm text-slate-800 font-medium">Addresse de facturation</div>
              {/* Right */}
              <div className="text-sm text-slate-800ml-4">
                <span className="mr-3">hello@cruip.com</span>
                <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Modifier</a>
              </div>
            </li>
          </ul>
        </section>

        {/* Invoices */}
        <section>
          <h3 className="text-xl leading-snug text-slate-800 font-bold mb-1">Factures</h3>
          {/* Table */}
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400">
              <tr className="flex flex-wrap md:table-row md:flex-no-wrap">
                <th className="w-full block md:w-auto md:table-cell py-2">
                  <div className="font-semibold text-left">Année</div>
                </th>
                <th className="w-full hidden md:w-auto md:table-cell py-2">
                  <div className="font-semibold text-left">Plan</div>
                </th>
                <th className="w-full hidden md:w-auto md:table-cell py-2">
                  <div className="font-semibold text-left">Montant</div>
                </th>
                <th className="w-full hidden md:w-auto md:table-cell py-2">
                  <div className="font-semibold text-right"></div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm">
              {/* Row */}
              <tr className="flex flex-wrap md:table-row md:flex-no-wrap border-b border-slate-200 py-2 md:py-0">
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-left font-medium text-slate-800">2021</div>
                </td>
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-left">Basic Plan - Annualy</div>
                </td>
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-left font-medium">$349.00</div>
                </td>
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-right flex items-center md:justify-end">
                    <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">HTML</a>
                    <span className="block w-px h-4 bg-slate-200 mx-2" aria-hidden="true"></span>
                    <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">PDF</a>
                  </div>
                </td>
              </tr>
              {/* Row */}
              <tr className="flex flex-wrap md:table-row md:flex-no-wrap border-b border-slate-200 py-2 md:py-0">
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-left font-medium text-slate-800">2020</div>
                </td>
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-left">Basic Plan - Annualy</div>
                </td>
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-left font-medium">$349.00</div>
                </td>
                <td className="w-full block md:w-auto md:table-cell py-0.5 md:py-2">
                  <div className="text-right flex items-center md:justify-end">
                    <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">HTML</a>
                    <span className="block w-px h-4 bg-slate-200 mx-2" aria-hidden="true"></span>
                    <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">PDF</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-slate-200 hover:border-slate-300 text-slate-600">Cancel</button>
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">Save Changes</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default BillingPanel;