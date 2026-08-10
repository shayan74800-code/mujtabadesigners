var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_vite = require("vite");

// src/data/initialProducts.ts
var INITIAL_PRODUCTS = [];

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var productsStore = [...INITIAL_PRODUCTS];
var usersStore = /* @__PURE__ */ new Map();
var pendingOTPs = /* @__PURE__ */ new Map();
var ordersStore = [];
var videoSettingsStore = {
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-white-dress-walking-41443-large.mp4",
  heroPosterUrl: "/assets/images/mujtaba_video_hero_1786177863771.jpg",
  showcaseVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-white-dress-walking-41443-large.mp4",
  showcasePosterUrl: "/assets/images/mujtaba_video_hero_1786177863771.jpg",
  showcaseTitle: "PURE LUXURY \u2022 DEFINE YOUR STYLE",
  showcaseSubtitle: "Watch the official Mujtaba Designer 2026 runway showcase featuring our signature emerald embroidered gown & gold-pinstripe bespoke suit.",
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
app.get("/api/settings/video", (req, res) => {
  return res.json(videoSettingsStore);
});
app.put("/api/settings/video", (req, res) => {
  try {
    const { heroVideoUrl, heroPosterUrl, showcaseVideoUrl, showcasePosterUrl, showcaseTitle, showcaseSubtitle } = req.body;
    if (heroVideoUrl) videoSettingsStore.heroVideoUrl = heroVideoUrl.trim();
    if (heroPosterUrl) videoSettingsStore.heroPosterUrl = heroPosterUrl.trim();
    if (showcaseVideoUrl) videoSettingsStore.showcaseVideoUrl = showcaseVideoUrl.trim();
    if (showcasePosterUrl) videoSettingsStore.showcasePosterUrl = showcasePosterUrl.trim();
    if (showcaseTitle) videoSettingsStore.showcaseTitle = showcaseTitle.trim();
    if (showcaseSubtitle) videoSettingsStore.showcaseSubtitle = showcaseSubtitle.trim();
    videoSettingsStore.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    return res.json({
      success: true,
      message: "Video settings updated successfully!",
      settings: videoSettingsStore
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update video settings." });
  }
});
var createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    console.warn("Nodemailer credentials not provided via environment variables. Email dispatches will be simulated.");
    return null;
  }
  return import_nodemailer.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { gmail, firstName, lastName, password } = req.body;
    if (!gmail || !firstName || !password) {
      return res.status(400).json({ error: "Gmail, First Name, and Password are required." });
    }
    const emailKey = gmail.trim().toLowerCase();
    const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 10 * 60 * 1e3;
    pendingOTPs.set(emailKey, {
      code: otpCode,
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : "",
      password,
      expiresAt
    });
    console.log(`[OTP GENERATED] Email: ${emailKey} | Code: ${otpCode}`);
    const transporter = createTransporter();
    let emailSent = false;
    let emailErrorMessage = "";
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Mujtaba Designer" <${process.env.EMAIL_USER}>`,
          to: emailKey,
          subject: `${otpCode} is your Mujtaba Designer Verification Code`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 4px; color: #0f172a; margin: 0;">MUJTABA DESIGNER</h1>
                <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #b45309; margin-top: 4px;">HAUTE COUTURE \u2022 ISLAMABAD & LAHORE</p>
              </div>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
              <p style="font-size: 16px; color: #334155; line-height: 1.6;">Dear <strong>${firstName}</strong>,</p>
              <p style="font-size: 15px; color: #475569; line-height: 1.6;">Thank you for registering with Mujtaba Designer. Please enter the following 6-digit verification code to activate your account:</p>
              
              <div style="text-align: center; margin: 35px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0f172a; background-color: #f8fafc; padding: 16px 32px; border-radius: 6px; border: 1px dashed #cbd5e1;">${otpCode}</span>
              </div>
              
              <p style="font-size: 13px; color: #94a3b8; text-align: center;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">\xA9 2026 Mujtaba Designer. All Rights Reserved. Contact Support: 03318858108</p>
            </div>
          `
        });
        emailSent = true;
      } catch (err) {
        console.error("Nodemailer send OTP error:", err);
        emailErrorMessage = err.message || "SMTP failed";
      }
    }
    if (transporter && !emailSent) {
      console.warn(`[OTP EMAIL FAILED] ${emailKey} - ${emailErrorMessage}`);
    }
    const baseResponse = {
      success: true,
      message: emailSent ? `Verification code dispatched to ${emailKey}` : `Verification code generated for ${emailKey}`,
      emailSent,
      emailErrorMessage: emailErrorMessage || void 0
    };
    if (process.env.NODE_ENV !== "production") {
      baseResponse.debugOtp = otpCode;
    }
    return res.json(baseResponse);
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ error: error.message || "Server error sending verification code." });
  }
});
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { gmail, code } = req.body;
    if (!gmail || !code) {
      return res.status(400).json({ error: "Gmail and 6-digit OTP code are required." });
    }
    const emailKey = gmail.trim().toLowerCase();
    const pendingData = pendingOTPs.get(emailKey);
    if (!pendingData) {
      return res.status(400).json({ error: "No pending verification found for this email. Please request a new code." });
    }
    if (Date.now() > pendingData.expiresAt) {
      pendingOTPs.delete(emailKey);
      return res.status(400).json({ error: "Verification code has expired. Please request a new code." });
    }
    if (pendingData.code !== code.trim()) {
      return res.status(400).json({ error: "Invalid verification code. Please check your Gmail and try again." });
    }
    const user = {
      id: `usr-${Date.now()}`,
      gmail: emailKey,
      firstName: pendingData.firstName,
      lastName: pendingData.lastName,
      isVerified: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    usersStore.set(emailKey, { user, password: pendingData.password });
    pendingOTPs.delete(emailKey);
    const token = `token_usr_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return res.json({
      success: true,
      message: "Account verified successfully!",
      user,
      token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to verify account." });
  }
});
app.post("/api/auth/login", (req, res) => {
  try {
    const { gmail, password } = req.body;
    if (!gmail || !password) {
      return res.status(400).json({ error: "Gmail and password are required." });
    }
    const emailKey = gmail.trim().toLowerCase();
    const existing = usersStore.get(emailKey);
    if (!existing || existing.password !== password) {
      return res.status(401).json({ error: "Invalid Gmail address or password." });
    }
    const token = `token_usr_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return res.json({
      success: true,
      message: "Login successful",
      user: existing.user,
      token
    });
  } catch (error) {
    return res.status(500).json({ error: "Server authentication error." });
  }
});
app.post("/api/auth/admin-login", (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[ADMIN LOGIN ATTEMPT] email=${email}`);
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    console.log(`[ADMIN CREDENTIALS] expected=${adminEmail} / ${adminPassword ? "***" : "not-set"}`);
    if (email === adminEmail && password === adminPassword) {
      const token = `admin_token_${Date.now()}`;
      return res.json({
        success: true,
        admin: { email: adminEmail, role: "admin" },
        token
      });
    }
    return res.status(401).json({ error: "Invalid Admin credentials." });
  } catch (error) {
    return res.status(500).json({ error: "Admin login error." });
  }
});
app.get("/api/products", (req, res) => {
  res.json({ products: productsStore });
});
app.post("/api/products", (req, res) => {
  try {
    const { title, description, price, salePrice, category, collection, images, sizes, inStock, isFeatured } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ error: "Title, price, and category are required." });
    }
    const newProd = {
      id: `prod-${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : "",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : void 0,
      category: category.trim(),
      collection: collection ? collection.trim() : void 0,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ["S", "M", "L"],
      inStock: inStock !== void 0 ? Boolean(inStock) : true,
      isFeatured: isFeatured !== void 0 ? Boolean(isFeatured) : false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    productsStore.unshift(newProd);
    return res.json({ success: true, product: newProd });
  } catch (err) {
    return res.status(500).json({ error: "Failed to add product." });
  }
});
app.put("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = productsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found." });
    }
    const current = productsStore[index];
    const updated = {
      ...current,
      ...req.body,
      id: current.id,
      price: req.body.price ? Number(req.body.price) : current.price,
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : current.salePrice
    };
    productsStore[index] = updated;
    return res.json({ success: true, product: updated });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update product." });
  }
});
app.delete("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    productsStore = productsStore.filter((p) => p.id !== id);
    return res.json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete product." });
  }
});
app.post("/api/orders", (req, res) => {
  try {
    const { userEmail, userName, phone, address, city, notes, items, totalAmount, paymentMethod } = req.body;
    if (!userEmail || !items || items.length === 0 || !address || !phone) {
      return res.status(400).json({ error: "Missing required order fields or items." });
    }
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `MD-${Math.floor(1e5 + Math.random() * 9e5)}`,
      userEmail: userEmail.trim().toLowerCase(),
      userName: userName ? userName.trim() : "Valued Customer",
      phone: phone.trim(),
      address: address.trim(),
      city: city ? city.trim() : "Lahore",
      notes: notes ? notes.trim() : "",
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || "cod",
      status: "Pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ordersStore.unshift(newOrder);
    console.log(`[ORDER PLACED - PENDING] Order #: ${newOrder.orderNumber} | Customer: ${newOrder.userEmail}`);
    return res.json({
      success: true,
      message: "Order placed successfully! Awaiting Admin CMS confirmation.",
      order: newOrder
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to place order." });
  }
});
app.get("/api/orders/my-orders", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "User email parameter required." });
  }
  const userEmail = email.trim().toLowerCase();
  const myOrders = ordersStore.filter((o) => o.userEmail === userEmail);
  return res.json({ orders: myOrders });
});
app.get("/api/orders/all", (req, res) => {
  return res.json({ orders: ordersStore });
});
app.delete("/api/orders/:id", (req, res) => {
  try {
    const { id } = req.params;
    const beforeLength = ordersStore.length;
    const filtered = ordersStore.filter((order) => order.id !== id);
    if (filtered.length === beforeLength) {
      return res.status(404).json({ error: "Order not found." });
    }
    ordersStore.length = 0;
    ordersStore.push(...filtered);
    return res.json({ success: true, message: "Order deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete order." });
  }
});
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }
    const order = ordersStore.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    order.status = status;
    if (status === "Confirmed") {
      order.confirmedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    let emailSent = false;
    let emailMessage = "";
    if (status === "Confirmed") {
      const transporter = createTransporter();
      if (transporter) {
        try {
          const itemsListHtml = order.items.map((item) => `
            <tr>
              <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155;">
                <strong>${item.title}</strong><br/>
                <span style="font-size: 12px; color: #64748b;">Size: ${item.size} | Qty: ${item.quantity}</span>
              </td>
              <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; text-align: right; font-weight: 600;">
                Rs. ${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          `).join("");
          await transporter.sendMail({
            from: `"Mujtaba Designer Admin" <${process.env.EMAIL_USER || "mujtabad427@gmail.com"}>`,
            to: order.userEmail,
            subject: `Order Confirmed! ${order.orderNumber} - Mujtaba Designer`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 40px 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="font-size: 26px; font-weight: 300; letter-spacing: 4px; color: #0f172a; margin: 0;">MUJTABA DESIGNER</h1>
                  <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #15803d; font-weight: 600; margin-top: 6px;">ORDER CONFIRMED BY ADMIN</p>
                </div>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 24px;">
                  <p style="font-size: 15px; color: #1e293b; margin: 0 0 8px 0;">Dear <strong>${order.userName}</strong>,</p>
                  <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.5;">Great news! Your order <strong>#${order.orderNumber}</strong> has been officially confirmed by our team and is now being prepared for dispatch.</p>
                </div>

                <h3 style="font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; color: #0f172a; margin-bottom: 12px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #f1f5f9;">
                      <th style="padding: 10px 8px; text-align: left; font-size: 12px; color: #475569;">ITEM</th>
                      <th style="padding: 10px 8px; text-align: right; font-size: 12px; color: #475569;">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsListHtml}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style="padding: 14px 8px; font-size: 15px; font-weight: 700; color: #0f172a;">Grand Total</td>
                      <td style="padding: 14px 8px; font-size: 16px; font-weight: 700; color: #0f172a; text-align: right;">Rs. ${order.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 20px;">
                  <p style="font-size: 13px; color: #475569; margin: 0 0 4px 0;"><strong>Shipping Address:</strong> ${order.address}, ${order.city}</p>
                  <p style="font-size: 13px; color: #475569; margin: 0;"><strong>Phone Contact:</strong> ${order.phone}</p>
                </div>

                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center;">Thank you for shopping with Mujtaba Designer. For inquiries or custom stitching assistance, contact us at 03318858108 or via WhatsApp.</p>
              </div>
            `
          });
          order.emailSent = true;
          emailSent = true;
          emailMessage = `Confirmation email dispatched to ${order.userEmail}`;
        } catch (mailErr) {
          console.error("Failed to send order confirmation email:", mailErr);
          emailMessage = `Order status updated to Confirmed, but email dispatch failed: ${mailErr.message}`;
        }
      }
    }
    return res.json({
      success: true,
      message: `Order status updated to ${status}. ${emailMessage}`,
      order,
      emailSent
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update order status." });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", brand: "Mujtaba Designer Store API", time: (/* @__PURE__ */ new Date()).toISOString() });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mujtaba Designer server active on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
