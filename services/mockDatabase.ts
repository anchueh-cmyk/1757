
import { User, CheckInRecord, UserStatus, EmergencyContact } from '../types';

const USER_KEY = 'anan_current_user';
const ALL_USERS_KEY = 'anan_all_users';

export const mockDatabase = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    const allUsers = mockDatabase.getAllUsers();
    const index = allUsers.findIndex(u => u.id === user.id);
    if (index > -1) {
      allUsers[index] = user;
    } else {
      allUsers.push(user);
    }
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
  },

  getAllUsers: (): User[] => {
    const data = localStorage.getItem(ALL_USERS_KEY);
    return data ? JSON.parse(data) : [];
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
    const lastCheckIn = user.lastCheckIn;
    
    if (lastCheckIn) {
      const today = new Date().toDateString();
      const last = new Date(lastCheckIn).toDateString();
      if (today === last) return user;
    }

    const newRecord: CheckInRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: now,
      status,
      message
    };

    let newStreak = 1;
    if (lastCheckIn) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = new Date(lastCheckIn).toDateString() === yesterday.toDateString();
      if (wasYesterday) newStreak = user.streak + 1;
      else if (new Date(lastCheckIn).toDateString() === new Date().toDateString()) newStreak = user.streak;
    }

    const updatedUser: User = {
      ...user,
      lastCheckIn: now,
      streak: newStreak,
      records: [newRecord, ...user.records].slice(0, 30),
    };

    mockDatabase.setCurrentUser(updatedUser);
    return updatedUser;
  },

  addContact: (userId: string, name: string, contact: string, type: 'email' | 'phone'): User | null => {
    const user = mockDatabase.getCurrentUser();
    if (!user || user.id !== userId) return null;

    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      contact,
      type
    };

    const updatedUser = {
      ...user,
      contacts: [...user.contacts, newContact]
    };

    mockDatabase.setCurrentUser(updatedUser);
    return updatedUser;
  },

  removeContact: (userId: string, contactId: string): User | null => {
    const user = mockDatabase.getCurrentUser();
    if (!user || user.id !== userId) return null;

    const updatedUser = {
      ...user,
      contacts: user.contacts.filter(c => c.id !== contactId)
    };

    mockDatabase.setCurrentUser(updatedUser);
    return updatedUser;
  }
};
