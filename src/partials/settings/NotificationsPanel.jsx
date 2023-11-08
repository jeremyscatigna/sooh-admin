import React, { useState } from 'react';

function NotificationsPanel() {

  const [comments, setComments] = useState(true);
  const [messages, setMessages] = useState(true);
  const [mentions, setMentions] = useState(false);

  return (
    <div className="grow">

      {/* Panel body */}
      <div className="p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">Mes Notifications</h2>

        {/* General */}
        <section>
          <h3 className="text-xl leading-snug text-slate-800 font-bold mb-1">Generale</h3>
          <ul>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Commentaires and réponses</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{comments ? 'On' : 'Off'}</div>
                <div className="form-switch">
                  <input type="checkbox" id="comments" className="sr-only" checked={comments} onChange={() => setComments(!comments)} />
                  <label className="bg-slate-400" htmlFor="comments">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Messages</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{messages ? 'On' : 'Off'}</div>
                <div className="form-switch">
                  <input type="checkbox" id="messages" className="sr-only" checked={messages} onChange={() => setMessages(!messages)} />
                  <label className="bg-slate-400" htmlFor="messages">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-slate-200">
              {/* Left */}
              <div>
                <div className="text-slate-800 font-semibold">Mentions</div>
              </div>
              {/* Right */}
              <div className="flex items-center ml-4">
                <div className="text-sm text-slate-400 italic mr-2">{mentions ? 'On' : 'Off'}</div>
                <div className="form-switch">
                  <input type="checkbox" id="mentions" className="sr-only" checked={mentions} onChange={() => setMentions(!mentions)} />
                  <label className="bg-slate-400" htmlFor="mentions">
                    <span className="bg-white shadow-sm" aria-hidden="true"></span>
                    <span className="sr-only">Enable smart sync</span>
                  </label>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>

      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-slate-200 hover:border-slate-300 text-slate-600">Annuler</button>
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">Sauvegarder</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default NotificationsPanel;