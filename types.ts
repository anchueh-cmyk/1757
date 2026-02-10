
export enum UserStatus {
  GREAT = '很好',
  OKAY = '還行',
  TIRED = '有點累',
  NEED_CONTACT = '需要聯繫'
}

export interface CheckInRecord {
  id: string;
  timestamp: number;
  status: UserStatus;
  message: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  contact: string; // Email or Phone
  type: 'email' | 'phone';
}

export interface User {
  id: string;
  username: string;
  lastCheckIn: number | null;
  streak: number;
  contacts: EmergencyContact[];
  records: CheckInRecord[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
