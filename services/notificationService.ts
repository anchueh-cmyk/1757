
import { User, UserStatus } from '../types';

const API_URL = 'http://localhost:3001/api/send-email';

export interface EmailResult {
  success: boolean;
  isMock: boolean;
  message?: string;
}

export const notificationService = {
  sendEmail: async (to: string, subject: string, body: string): Promise<EmailResult> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text: body }),
        // 設定較短的超時，如果後端沒開就快速切換模擬模式
        signal: AbortSignal.timeout(3000)
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`%c[真實發送成功] 郵件已發送至: ${to}`, 'color: #22c55e; font-weight: bold;');
        return { success: true, isMock: false };
      } else {
        throw new Error(data.message || '後端回傳錯誤');
      }
    } catch (error: any) {
      console.warn(`%c[切換至模擬模式] 原因: ${error.message}`, 'color: #f97316;');
      console.log(`%c[模擬] To: ${to}\nSubject: ${subject}\nContent: ${body}`, 'color: #64748b;');
      
      return { 
        success: true, 
        isMock: true, 
        message: error.message === 'The operation was aborted due to timeout' ? '找不到後端伺服器' : error.message 
      };
    }
  },

  sendCheckInNotification: async (user: User, status: UserStatus, message: string) => {
    const results: EmailResult[] = [];
    for (const contact of user.contacts) {
      if (contact.type === 'email') {
        const subject = `【安安簽到】您的好友 ${user.username} 剛剛報了平安`;
        const body = `您好 ${contact.name}，\n\n您的好友 ${user.username} 剛剛在「安安簽到系統」更新了狀態：\n\n狀態：${status}\n留言：${message || '我很好，不用擔心。'}\n時間：${new Date().toLocaleString()}\n\n系統已記錄他的連續存活天數為 ${user.streak} 天。`;
        const res = await notificationService.sendEmail(contact.contact, subject, body);
        results.push(res);
      }
    }
    return results;
  },

  sendAlertNotification: async (user: User) => {
    const results: EmailResult[] = [];
    for (const contact of user.contacts) {
      if (contact.type === 'email') {
        const subject = `🚨【緊急警報】您的好友 ${user.username} 已超過 24 小時未簽到`;
        const body = `緊急通知 ${contact.name}，\n\n您的好友 ${user.username} 目前已超過 24 小時未在「安安簽到系統」報平安。\n\n最後簽到時間：${user.lastCheckIn ? new Date(user.lastCheckIn).toLocaleString() : '從未簽到'}\n\n請嘗試主動聯繫他以確保安全。`;
        const res = await notificationService.sendEmail(contact.contact, subject, body);
        results.push(res);
      }
    }
    return results;
  }
};
