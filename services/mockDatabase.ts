
import { User, CheckInRecord, UserStatus, EmergencyContact } from '../types';

const USER_KEY = 'anan_current_user';
const ALL_USERS_KEY = 'anan_all_users';

export const mockDatabase = {
  init: () => {
    // 不再預設測試用戶，初始為空陣列
    if (!localStorage.getItem(ALL_USERS_KEY)) {
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify([]));
    }
  },

  getAllUsers: (): User[] => {
    const data = localStorage.getItem(ALL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  findUserByIdentifier: (identifier: string): User | undefined => {
    const users = mockDatabase.getAllUsers();
    // 管理員是硬編碼的，不在數據庫中
    if (identifier === 'adminalan') return undefined; 
    return users.find(u => u.username === identifier || u.id === identifier);
  },

  register: (username: string): User | null => {
    const users = mockDatabase.getAllUsers();
    if (users.find(u => u.username === username)) return null;

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 5),
      username,
      lastCheckIn: null,
      streak: 0,
      contacts: [],
      records: []
    };
    
    users.push(newUser);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    const basic = JSON.parse(data);
    if (basic.isAdmin) return basic;
    const all = mockDatabase.getAllUsers();
    return all.find(u => u.id === basic.id) || null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (!user.isAdmin) {
      const allUsers = mockDatabase.getAllUsers();
      const index = allUsers.findIndex(u => u.id === user.id);
      if (index > -1) {
        allUsers[index] = user;
      } else {
        allUsers.push(user);
      }
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
    }
  },

  clearCurrentUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  checkIn: (userId: string, status: UserStatus, message: string): User | null => {
    const users = mockDatabase.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const user = users[userIndex];
    const now = Date.now();
    
    if (user.lastCheckIn) {
      const today = new Date().toDateString();
      const last = new Date(user.lastCheckIn).toDateString();
      if (today === last) return user;
    }

    const newRecord: CheckInRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: now,
      status,
      message
    };

    let newStreak = 1;
    if (user.lastCheckIn) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = new Date(user.lastCheckIn).toDateString() === yesterday.toDateString();
      if (wasYesterday) {
        newStreak = user.streak + 1;
      }
    }

    user.lastCheckIn = now;
    user.streak = newStreak;
    user.records = [newRecord, ...user.records].slice(0, 30);

    users[userIndex] = user;
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  addContact: (userId: string, name: string, contact: string, type: 'email' | 'phone'): User | null => {
    const users = mockDatabase.getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      contact,
      type
    };

    users[idx].contacts.push(newContact);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(USER_KEY, JSON.stringify(users[idx]));
    return users[idx];
  },

  removeContact: (userId: string, contactId: string): User | null => {
    const users = mockDatabase.getAllUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;

    users[idx].contacts = users[idx].contacts.filter(c => c.id !== contactId);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(USER_KEY, JSON.stringify(users[idx]));
    return users[idx];
  }
};
