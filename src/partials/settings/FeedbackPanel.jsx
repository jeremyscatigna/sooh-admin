import React from 'react';

function FeedbackPanel() {
  return (
    <div className="grow">

      {/* Panel body */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl text-primary font-bold mb-4">Donner votre avis</h2>
          <div className="text-sm">Notre produit dépend des commentaires des clients pour améliorer l'expérience globale !</div>
        </div>

        {/* Rate */}
        <section>
          <h3 className="text-xl leading-snug text-primary font-bold mb-6">Dans quelle mesure nous recommanderiez-vous à un ami ou un collègue ?</h3>
          <div className="w-full max-w-xl">
            <div className="relative">
              <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200" aria-hidden="true"></div>
              <ul className="relative flex justify-between w-full">
                <li className="flex">
                  <button className="w-3 h-3 rounded-full bg-white border-2 border-slate-400">
                    <span className="sr-only">1</span>
                  </button>
                </li>
                <li className="flex">
                  <button className="w-3 h-3 rounded-full bg-white border-2 border-slate-400">
                    <span className="sr-only">2</span>
                  </button>
                </li>
                <li className="flex">
                  <button className="w-3 h-3 rounded-full bg-pink-500 border-2 border-pink-500">
                    <span className="sr-only">3</span>
                  </button>
                </li>
                <li className="flex">
                  <button className="w-3 h-3 rounded-full bg-white border-2 border-slate-400">
                    <span className="sr-only">4</span>
                  </button>
                </li>
                <li className="flex">
                  <button className="w-3 h-3 rounded-full bg-white border-2 border-slate-400">
                    <span className="sr-only">5</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="w-full flex justify-between text-sm text-primary italic mt-3">
              <div>Not at all</div>
              <div>Extremely likely</div>
            </div>
          </div>
        </section>

        {/* Tell us in words */}
        <section>
          <h3 className="text-xl leading-snug text-primary font-bold mb-5">Dites-nous avec des mots</h3>
          {/* Form */}
          <label className="sr-only" htmlFor="feedback">Laisser un commentaire</label>
          <textarea id="feedback" className="form-textarea rounded-xl bg-hover placeholder-secondary text-secondary border-none w-full focus:border-slate-300" rows="4" placeholder="j'apprécie vraiment…"></textarea>
        </section>
      </div>

      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-primary hover:border-primary text-primary">Annuler</button>
            <button className="btn bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full text-white ml-3">Sauvegarder</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default FeedbackPanel;