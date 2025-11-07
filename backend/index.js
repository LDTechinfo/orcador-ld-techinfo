
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));

const PORT = process.env.PORT || 4000;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/send-quote', async (req, res) => {
  try {
    const { to, subject, html, pdfBase64 } = req.body;
    if (!to) return res.status(400).json({ error: 'Missing recipient (to)' });

    const attachments = [];
    if (pdfBase64) {
      const matches = pdfBase64.match(/^data:(.+);base64,(.*)$/);
      if (matches) {
        attachments.push({ filename: 'orcamento.pdf', content: Buffer.from(matches[2], 'base64') });
      } else {
        // try to extract after comma
        const idx = pdfBase64.indexOf(',');
        if (idx !== -1) {
          attachments.push({ filename: 'orcamento.pdf', content: Buffer.from(pdfBase64.slice(idx+1), 'base64') });
        }
      }
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject: subject || 'Orçamento - L&D Techinfo',
      html: html || '<p>Orçamento anexo</p>',
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar email', detail: String(err) });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
