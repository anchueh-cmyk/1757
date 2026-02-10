
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- 配置區 ---
// 這裡請填入您的資訊
const CONFIG = {
  user: 'YOUR_EMAIL@gmail.com', // 您的 Gmail
  pass: 'YOUR_APP_PASSWORD'    // 剛剛取得的 16 位元密碼
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.user,
    pass: CONFIG.pass
  }
});

// 健康檢查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'running', email_config: CONFIG.user !== 'YOUR_EMAIL@gmail.com' });
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (CONFIG.user === 'YOUR_EMAIL@gmail.com') {
    return res.status(400).json({ 
      success: false, 
      message: '伺服器配置不完整：請在 server.js 中填寫您的 Gmail 與應用程式密碼' 
    });
  }

  console.log(`[SMTP] 正在發送郵件至: ${to}`);

  const mailOptions = {
    from: `"安安簽到系統" <${CONFIG.user}>`,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP] 郵件發送成功！`);
    res.status(200).json({ success: true, message: '郵件已發送' });
  } catch (error) {
    console.error('[SMTP] 失敗:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'SMTP 伺服器錯誤: ' + error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log('-----------------------------------------');
  console.log(`🚀 安安後端已啟動: http://localhost:${PORT}`);
  console.log(`📌 請確保已在 server.js 填寫您的 Gmail 資訊`);
  console.log('-----------------------------------------');
});
