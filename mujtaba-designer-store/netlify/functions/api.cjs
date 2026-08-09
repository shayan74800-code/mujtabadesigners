const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const { pathToFileURL } = require('url');

const repoProductsFilePath = path.resolve(__dirname, 'products.json');
const tempProductsFilePath = path.resolve(process.env.TMPDIR || '/tmp', 'products.json');

const usersStore = new Map();
const pendingOtps = new Map();
const productsStore = [];
const ordersStore = [];
const videoSettingsStore = {
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-white-dress-walking-41443-large.mp4',
  heroPosterUrl: '/assets/images/mujtaba_video_hero_1786177863771.jpg',
  showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-white-dress-walking-41443-large.mp4',
  showcasePosterUrl: '/assets/images/mujtaba_video_hero_1786177863771.jpg',
  showcaseTitle: 'PURE LUXURY • DEFINE YOUR STYLE',
  showcaseSubtitle: 'Watch the official Mujtaba Designer 2026 runway showcase featuring our signature emerald embroidered gown & gold-pinstripe bespoke suit.',
  updatedAt: new Date().toISOString(),
};

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('EMAIL_USER or EMAIL_PASS not configured. OTP email will not be sent.');
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

const DEFAULT_ADMIN_EMAIL = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

const saveProductsToFile = async () => {
  try {
    // Always save runtime changes to the temporary function filesystem.
    await fs.promises.writeFile(tempProductsFilePath, JSON.stringify(productsStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Unable to save products to temp file:', err);
  }
};

const loadProductsFromFile = async () => {
  let raw;
  try {
    raw = await fs.promises.readFile(tempProductsFilePath, 'utf-8');
  } catch (err) {
    try {
      raw = await fs.promises.readFile(repoProductsFilePath, 'utf-8');
    } catch (innerErr) {
      raw = null;
    }
  }

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        productsStore.length = 0;
        productsStore.push(...parsed);
        return;
      }
    } catch (err) {
      console.warn('Unable to parse products file:', err);
    }
  }

  try {
    const productsPath = path.resolve(__dirname, '../../src/data.js');
    const dataModule = await import(pathToFileURL(productsPath).href);
    if (Array.isArray(dataModule.INITIAL_PRODUCTS)) {
      productsStore.length = 0;
      productsStore.push(...dataModule.INITIAL_PRODUCTS);
      await saveProductsToFile();
    }
  } catch (err) {
    console.warn('Unable to load initial products for API route:', err);
  }
};

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
  try {
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

    let route = event.path || '/';
    if (route.startsWith('/.netlify/functions/api')) {
      route = route.replace(/^\/\.netlify\/functions\/api/, '');
    } else {
      route = route.replace(/^\/api/, '');
    }
    route = route || '/';
    const method = event.httpMethod;
    const query = event.queryStringParameters || {};

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
        : `OTP generated for ${emailKey}. Email delivery failed; check SMTP configuration.`,
      emailSent: emailResult.emailSent,
      emailErrorMessage: emailResult.emailErrorMessage,
    };
    if (!emailResult.emailSent) {
      response.debugOtp = otpCode;
    } else if (process.env.NODE_ENV !== 'production') {
      response.debugOtp = otpCode;
    }
    return jsonResponse(200, response);
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

  if (route === '/auth/admin-login' && method === 'POST') {
    const { email, password } = body;
    if (!email || !password) {
      return jsonResponse(400, { error: 'Email and password are required.' });
    }

    let expectedEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
    let expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
      return jsonResponse(500, { error: 'Admin credentials are not configured.' });
    }

    if (email === expectedEmail && password === expectedPassword) {
      return jsonResponse(200, {
        success: true,
        admin: { email: expectedEmail, role: 'admin' },
        token: `admin_token_${Date.now()}`,
      });
    }

    return jsonResponse(401, { error: 'Invalid Admin credentials.' });
  }

  if (route === '/settings/video' && method === 'GET') {
    return jsonResponse(200, videoSettingsStore);
  }

  if (route === '/settings/video' && method === 'PUT') {
    const { heroVideoUrl, heroPosterUrl, showcaseVideoUrl, showcasePosterUrl, showcaseTitle, showcaseSubtitle } = body;
    if (heroVideoUrl) videoSettingsStore.heroVideoUrl = heroVideoUrl.trim();
    if (heroPosterUrl) videoSettingsStore.heroPosterUrl = heroPosterUrl.trim();
    if (showcaseVideoUrl) videoSettingsStore.showcaseVideoUrl = showcaseVideoUrl.trim();
    if (showcasePosterUrl) videoSettingsStore.showcasePosterUrl = showcasePosterUrl.trim();
    if (showcaseTitle) videoSettingsStore.showcaseTitle = showcaseTitle.trim();
    if (showcaseSubtitle) videoSettingsStore.showcaseSubtitle = showcaseSubtitle.trim();
    videoSettingsStore.updatedAt = new Date().toISOString();

    return jsonResponse(200, {
      success: true,
      message: 'Video settings updated successfully.',
      settings: videoSettingsStore,
    });
  }

  if (route === '/products' && method === 'GET') {
    if (productsStore.length === 0) {
      await loadProductsFromFile();
    }
    return jsonResponse(200, { products: productsStore });
  }

  if (route === '/products' && method === 'POST') {
    await loadProductsFromFile();
    const { title, description, price, salePrice, category, collection, images, sizes, inStock, isFeatured } = body;
    if (!title || !price || !category) {
      return jsonResponse(400, { error: 'Title, price, and category are required.' });
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      category: category.trim(),
      collection: collection ? collection.trim() : undefined,
      images: Array.isArray(images) && images.length > 0 ? images : [],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L'],
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      createdAt: new Date().toISOString(),
    };
    productsStore.unshift(newProd);
    await saveProductsToFile();
    return jsonResponse(200, { success: true, product: newProd });
  }

  if (route.startsWith('/products/') && method === 'PUT') {
    await loadProductsFromFile();
    await loadProductsFromFile();
    const productId = route.replace('/products/', '');
    const existingIndex = productsStore.findIndex((p) => p.id === productId);
    if (existingIndex === -1) {
      return jsonResponse(404, { error: 'Product not found.' });
    }

    productsStore[existingIndex] = {
      ...productsStore[existingIndex],
      ...body,
      price: body.price !== undefined ? Number(body.price) : productsStore[existingIndex].price,
      salePrice: body.salePrice !== undefined ? Number(body.salePrice) : productsStore[existingIndex].salePrice,
    };
    await saveProductsToFile();

    return jsonResponse(200, { success: true, product: productsStore[existingIndex] });
  }

  if (route.startsWith('/products/') && method === 'DELETE') {
    await loadProductsFromFile();
    const productId = route.replace('/products/', '');
    const beforeLength = productsStore.length;
    const filtered = productsStore.filter((p) => p.id !== productId);
    if (filtered.length === beforeLength) {
      return jsonResponse(404, { error: 'Product not found.' });
    }
    productsStore.length = 0;
    productsStore.push(...filtered);
    await saveProductsToFile();
    return jsonResponse(200, { success: true, message: 'Product deleted successfully.' });
  }

  if (route === '/orders' && method === 'POST') {
    const { userEmail, userName, phone, address, city, notes, items, totalAmount, paymentMethod } = body;
    if (!userEmail || !items || items.length === 0 || !address || !phone) {
      return jsonResponse(400, { error: 'Missing required order fields or items.' });
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `MD-${Math.floor(100000 + Math.random() * 900000)}`,
      userEmail: userEmail.trim().toLowerCase(),
      userName: userName ? userName.trim() : 'Valued Customer',
      phone: phone.trim(),
      address: address.trim(),
      city: city ? city.trim() : 'Lahore',
      notes: notes ? notes.trim() : '',
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'cod',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    ordersStore.unshift(newOrder);
    return jsonResponse(200, { success: true, message: 'Order placed successfully! Awating admin confirmation.', order: newOrder });
  }

  if (route === '/orders/my-orders' && method === 'GET') {
    const email = query.email;
    if (!email) {
      return jsonResponse(400, { error: 'User email parameter required.' });
    }
    const normalized = email.trim().toLowerCase();
    const myOrders = ordersStore.filter((o) => o.userEmail === normalized);
    return jsonResponse(200, { orders: myOrders });
  }

  if (route === '/orders/all' && method === 'GET') {
    return jsonResponse(200, { orders: ordersStore });
  }

  if (route.startsWith('/orders/') && method === 'DELETE') {
    const orderId = route.replace('/orders/', '');
    const beforeLength = ordersStore.length;
    const filtered = ordersStore.filter((o) => o.id !== orderId);
    if (filtered.length === beforeLength) {
      return jsonResponse(404, { error: 'Order not found.' });
    }
    ordersStore.length = 0;
    ordersStore.push(...filtered);
    return jsonResponse(200, { success: true, message: 'Order deleted successfully.' });
  }

  if (route.startsWith('/orders/') && route.endsWith('/status') && method === 'PUT') {
    const orderId = route.replace(/^\/orders\//, '').replace(/\/status$/, '');
    const { status } = body;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return jsonResponse(400, { error: 'Invalid status value.' });
    }
    const order = ordersStore.find((o) => o.id === orderId);
    if (!order) {
      return jsonResponse(404, { error: 'Order not found.' });
    }
    order.status = status;
    if (status === 'Confirmed') {
      order.confirmedAt = new Date().toISOString();
    }
    return jsonResponse(200, { success: true, message: `Order status updated to ${status}.`, order });
  }

  return jsonResponse(404, { error: 'API route not found.' });
  } catch (error) {
    console.error('API handler error:', error);
    return jsonResponse(502, { error: 'Server error handling API request.', details: error?.message || 'Unknown error' });
  }
};
