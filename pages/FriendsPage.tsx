
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
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-5 duration-700 mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-light text-slate-800">通知親友</h2>
          <p className="text-slate-400 text-sm mt-1">超過 24 小時未簽到，系統將自動連繫以下人員</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`btn-interact w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${showAdd ? 'bg-slate-800' : 'bg-orange-500 shadow-orange-100'}`}
        >
          <svg className={`w-6 h-6 transition-transform duration-500 ${showAdd ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="glass-card rounded-[32px] p-6 mb-8 border-orange-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              required
              placeholder="親友名稱"
              className="px-4 py-4 bg-white/50 rounded-[20px] border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
            />
            <select
              className="px-4 py-4 bg-white/50 rounded-[20px] border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
              value={newContact.type}
              onChange={(e) => setNewContact({...newContact, type: e.target.value as any})}
            >
              <option value="email">接收郵件通知</option>
              <option value="phone">接收簡訊通知</option>
            </select>
          </div>
          <input
            required
            placeholder={newContact.type === 'email' ? "親友的 Email" : "親友的 手機號碼"}
            className="w-full px-4 py-4 bg-white/50 rounded-[20px] border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            value={newContact.contact}
            onChange={(e) => setNewContact({...newContact, contact: e.target.value})}
          />
          <button type="submit" className="btn-interact w-full py-4 bg-slate-800 text-white rounded-[20px] font-medium hover:bg-slate-900 shadow-lg shadow-slate-100">
            加入守護名單
          </button>
        </form>
      )}

      <div className="space-y-4">
        {user.contacts.length > 0 ? user.contacts.map((contact, index) => (
          <div 
            key={contact.id} 
            className="glass-card rounded-[28px] p-5 flex justify-between items-center group transition-all duration-500 hover:shadow-xl hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm transition-all group-hover:bg-orange-50">
                {contact.type === 'email' ? (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">{contact.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{contact.contact}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(contact.id)}
              className="btn-interact p-3 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full hover:bg-red-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )) : (
          <div className="py-24 text-center glass-card rounded-[40px] border-dashed border-2 border-slate-100">
            <p className="text-slate-300 italic font-light">目前名單空空如也，點擊右上角加入</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
