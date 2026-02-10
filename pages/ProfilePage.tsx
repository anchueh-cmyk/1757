
import React from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-5 duration-500">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-orange-100 rounded-[32px] flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
           <img 
            src={`https://picsum.photos/seed/${user.username}/200`} 
            alt="avatar" 
            className="w-full h-full object-cover opacity-80"
           />
        </div>
        <h2 className="text-2xl font-light text-slate-800">{user.username}</h2>
        <p className="text-slate-400 text-sm">守護 ID: {user.id}</p>
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-[24px] p-6 flex justify-between items-center">
          <span className="text-slate-500">通知開關</span>
          <div className="w-12 h-6 bg-orange-500 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="glass-card rounded-[24px] p-6 flex justify-between items-center">
          <span className="text-slate-500">未簽到提醒閥值</span>
          <span className="text-slate-800 font-medium">24 小時</span>
        </div>
        <div className="glass-card rounded-[24px] p-6 flex justify-between items-center">
          <span className="text-slate-500">語言</span>
          <span className="text-slate-800">繁體中文</span>
        </div>
        <div className="p-6 text-center text-slate-300 text-xs">
          版本 1.0.0 · 安安簽到系統
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
