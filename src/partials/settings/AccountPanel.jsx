import React, { useState } from 'react';

import Image from '../../images/user-avatar-80.png';

function AccountPanel() {

  const [sync, setSync] = useState(false);

  return (
    <div className="grow">
      {/* Panel body */}
      <div className="p-6 space-y-6">
        <h2 className="text-2xl text-primary font-bold mb-5">Mon compte</h2>
        {/* Picture */}
        <section>
          <div className="flex items-center">
            <div className="mr-4">
              <img className="w-20 h-20 rounded-full" src={Image} width="80" height="80" alt="User upload" />
            </div>
            <button className="btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white">Changer</button>
          </div>
        </section>
        {/* Business Profile */}
        <section>
          <h2 className="text-xl leading-snug text-primary font-bold mb-1">Profil d'entreprise</h2>
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="name">Nom de l'entreprise</label>
              <input id="name" className="form-input rounded-full bg-hover placeholder-secondary text-secondary border-none w-full" type="text" />
            </div>
            <div className="sm:w-1/3">
              <label className="block text-sm font-medium mb-1" htmlFor="location">Emplacement</label>
              <input id="location" className="form-input rounded-full bg-hover placeholder-secondary text-secondary border-none w-full" type="text" />
            </div>
          </div>
        </section>
        {/* Email */}
        <section>
          <h2 className="text-xl leading-snug text-primary font-bold mb-1">Email</h2>
          <div className="flex flex-wrap mt-5">
            <div className="mr-2">
              <label className="sr-only" htmlFor="email">Email</label>
              <input id="email" className="form-input rounded-full bg-hover placeholder-secondary text-secondary border-none" type="email" />
            </div>
            <button className="btn-sm bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white">Changer</button>
          </div>
        </section>
        {/* Password */}
        <section>
          <h2 className="text-xl leading-snug text-primary font-bold mb-1">Mot de passe</h2>
          <div className="mt-5">
            <button className="btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white">Definir un nouveau mot de passe</button>
          </div>
        </section>
        {/* Smart Sync */}
      </div>
      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-primary hover:border-slate-300 text-primary">Annuler</button>
            <button className="btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white ml-3">Sauvegarder</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccountPanel;