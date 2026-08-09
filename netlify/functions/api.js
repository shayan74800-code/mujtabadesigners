const nodemailer = require('nodemailer');

const usersStore = new Map();
const pendingOtps = new Map();

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('EMAIL_USER or EMAIL_PASS not found in environment. OTP email will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  },
  body: JSON.stringify(payload),
});

const sendOtpEmail = async (email, otpCode, firstName) => {
  const transporter = createTransporter();
  if (!transporter) {
    return { emailSent: false, emailErrorMessage: 'Email credentials not configured.' };
  }

  try {
    await transporter.sendMail({
      from: `"Mujtaba Designer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${otpCode} is your Mujtaba Designer verification code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h1 style="font-size: 22px; color: #0f172a; margin: 0 0 20px;">Mujtaba Designer</h1>
          <p style="font-size: 16px; color: #334155;">Hello <strong>${firstName}</strong>,</p>
          <p style="font-size: 15px; color: #475569;">Please use the verification code below to complete your registration:</p>
          <div style="margin: 24px 0; padding: 22px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; font-size: 24px; letter-spacing: 0.3em; text-align: center; color: #0f172a;">
            ${otpCode}
          </div>
          <p style="font-size: 13px; color: #64748b;">This code expires in 10 minutes. If you did not request it, please ignore this email.</p>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 28px;">© Mujtaba Designer</p>
        </div>
      `,
    });
    return { emailSent: true };
  } catch (err) {
    console.error('OTP email send failed:', err);
    return { emailSent: false, emailErrorMessage: err.message || 'Failed to send OTP email.' };
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      return jsonResponse(400, { error: 'Invalid JSON body.' });
    }
  }

  const route = event.path.replace(/^\/api/, '') || '/';
  const method = event.httpMethod;

  if (route === '/auth/send-otp' && method === 'POST') {
    const { gmail, firstName, lastName, password } = body;
    if (!gmail || !firstName || !password) {
      return jsonResponse(400, { error: 'Gmail, firstName and password are required.' });
    }

    const emailKey = gmail.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    pendingOtps.set(emailKey, {
      code: otpCode,
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      password,
      expiresAt,
    });

    const emailResult = await sendOtpEmail(emailKey, otpCode, firstName.trim());
    const response = {
      success: true,
      message: emailResult.emailSent
        ? `Verification code sent to ${emailKey}`
        : `OTP generated for ${emailKey} but email could not be sent.`,
      emailSent: emailResult.emailSent,
      emailErrorMessage: emailResult.emailErrorMessage,
    };
    if (process.env.NODE_ENV !== 'production') {
      response.debugOtp = otpCode;
    }

    return jsonResponse(200, response);
  }

  if (route === '/auth/verify-otp' && method === 'POST') {
    const { gmail, code } = body;
    if (!gmail || !code) {
      return jsonResponse(400, { error: 'Gmail and code are required.' });
    }

    const emailKey = gmail.trim().toLowerCase();
    const pendingData = pendingOtps.get(emailKey);
    if (!pendingData) {
      return jsonResponse(400, { error: 'No OTP pending for this Gmail. Please request a new code.' });
    }

    if (Date.now() > pendingData.expiresAt) {
      pendingOtps.delete(emailKey);
      return jsonResponse(400, { error: 'OTP expired. Please request a new code.' });
    }

    if (pendingData.code !== code.trim()) {
      return jsonResponse(400, { error: 'Invalid verification code.' });
    }

    const user = {
      id: `usr-${Date.now()}`,
      gmail: emailKey,
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    usersStore.set(emailKey, { user, password: pendingData.password });
    pendingOtps.delete(emailKey);

    return jsonResponse(200, {
      success: true,
      message: 'Account verified successfully.',
      user,
      token: `token_usr_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    });
  }

  if (route === '/auth/login' && method === 'POST') {
    const { gmail, password } = body;
    if (!gmail || !password) {
      return jsonResponse(400, { error: 'Gmail and password are required.' });
    }

    const account = usersStore.get(gmail.trim().toLowerCase());
    if (!account || account.password !== password) {
      return jsonResponse(401, { error: 'Invalid Gmail or password.' });
    }

    return jsonResponse(200, {
      success: true,
      message: 'Login successful.',
      user: account.user,
      token: `token_usr_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    });
  }

  return jsonResponse(404, { error: 'API route not found.' });
};
