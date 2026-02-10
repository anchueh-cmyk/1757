
import React, { useState } from 'react';
import { User, EmergencyContact } from '../types';
import { mockDatabase } from '../services/mockDatabase';

interface FriendsPageProps {
  user: User;
  onUpdate: () => void;
}

const FriendsPage: React.FC<FriendsPageProps> = ({ user, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', contact: '', type: 'email' as 'email' | 'phone' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    mockDatabase.addContact(user.id, newContact.name, newContact.contact, newContact.type);
    setNewContact({ name: '', contact: '', type: 'email' });
    setShowAdd(false);
    onUpdate();
  };

  const handleRemove = (id: string) => {
    mockDatabase.removeContact(user.id, id);
    onUpdate();
  };

  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-light text-slate-800">關注列表</h2>
          <p className="text-slate-400 text-sm mt-1">若您超過 24 小時未簽到，我們將透過以下方式通知他們</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 transition-transform active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAdd ? "M20 12H4" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
          </svg>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="glass-card rounded-3xl p-6 mb-8 border-orange-100 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              required
              placeholder="對方稱呼"
              className="px-4 py-3 bg-white rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
            />
            <select
              className="px-4 py-3 bg-white rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={newContact.type}
              onChange={(e) => setNewContact({...newContact, type: e.target.value as any})}
            >
              <option value="email">郵箱通知</option>
              <option value="phone">手機簡訊</option>
            </select>
          </div>
          <input
            required
            placeholder={newContact.type === 'email' ? "example@mail.com" : "138-xxxx-xxxx"}
            className="w-full px-4 py-3 bg-white rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            value={newContact.contact}
            onChange={(e) => setNewContact({...newContact, contact: e.target.value})}
          />
          <button type="submit" className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition-colors">
            確認添加
          </button>
        </form>
      )}

      <div className="space-y-4">
        {user.contacts.length > 0 ? user.contacts.map((contact) => (
          <div key={contact.id} className="glass-card rounded-[24px] p-5 flex justify-between items-center group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                {contact.type === 'email' ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="font-medium text-slate-800">{contact.name}</h4>
                <p className="text-xs text-slate-400">{contact.contact}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(contact.id)}
              className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )) : (
          <div className="py-20 text-center glass-card rounded-[32px] border-dashed border-2 border-slate-100">
            <p className="text-slate-300 italic">還沒有添加親友哦</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
