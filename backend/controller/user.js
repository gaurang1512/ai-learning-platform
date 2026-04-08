import TryCatch from "../middleware/TryCatch.js";
import sanitize from "mongo-sanitize";
import registerSchema from "../config/zod.js";
import {
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../config/zod.js";
import {
  loginSchema,
  teacherRegisterSchema,
  studentRegisterSchema,
} from "../config/zod.js";
import { redisClient } from "../index.js";
import { User } from "../models/User.js";
import { TeacherProfile } from "../models/TeacherProfile.js";
import { StudentProfile } from "../models/StudentProfile.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getVerifyEmailHtml } from "../config/html.js";
import { getOtpHtml } from "../config/html.js";
import { getForgotPasswordHtml } from "../config/html.js";
import {
  generateToken,
  verifyRefreshToken,
  generateAccessToken,
  revokeRefreshToken,
} from "../config/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    //This will automatically tell in which field error is there
    const zodError = validation.error;

    //Above line give a big error In this we are distructuring that whole error
    let firstErrorMessage = "Validation Failed";
    let allError = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));

      firstErrorMessage = allError[0]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allError,
    });
  }

  const { name, email, password } = validation.data;

  //Seting rate limit
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      //429 status code is for too many requests
      message: "Too many requests, try again later",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  //hashing password
  const hashPassword = await bcrypt.hash(password, 10);

  // (url)http://import.meta.env.VITE_SERVER_URL/(Token)dsbkhasfbefb and we will verify this and this will be stored in radis for 5 min
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const datatoStore = JSON.stringify({
    name,
    email,
    password: hashPassword,
  });

  //                                            //expiry time 5 min
  await redisClient.set(verifyKey, datatoStore, { EX: 300 });

  const subject = "verify your email for Account creation";

  //after creating html.js file
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });

  //1 email will be send per second setting rate limit to send email
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, a verification link has been send.it will expire in 5 minutes",
  });
});

export const registerTeacher = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = teacherRegisterSchema.safeParse(sanitizedBody);
  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation Failed";
    let allError = [];
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allError[0]?.message || "Validation Error";
    }
    return res
      .status(400)
      .json({ message: firstErrorMessage, error: allError });
  }
  const { name, email, password } = validation.data;
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res
      .status(429)
      .json({ message: "Too many requests, try again later" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;
  const datatoStore = JSON.stringify({
    role: "teacher",
    name,
    email,
    password: hashPassword,
  });
  await redisClient.set(verifyKey, datatoStore, { EX: 300 });
  const subject = "Verify your email for Teacher account";
  const html = getVerifyEmailHtml({ email, token: verifyToken });
  sendMail({ email, subject, html });
  //await sendMail({ email, subject, html });
  /*
  ❓ Will async here cause error?

👉 NO — async itself is NOT the problem ✅
Your code is perfectly valid:

const sendMail = async ({ email, subject, html }) => {
  ...
  await transport.sendMail(...)
};

✔️ This will NOT throw error by itself

⚠️ REAL PROBLEM (IMPORTANT)

The issue is HOW you are calling it in your register API:

await sendMail({ email, subject, html });

👉 This means:

Your API waits until email is sent
Gmail SMTP can take 5–20 seconds
On Render → even slower

👉 Result:

User clicks signup → waits → waits → timeout ❌
  */
  //await redisClient.set(rateLimitKey, "true", { EX: 60 });
  res.json({
    message:
      "If your email is valid, a verification link has been send.it will expire in 5 minutes",
  });
});

export const registerStudent = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = studentRegisterSchema.safeParse(sanitizedBody);
  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation Failed";
    let allError = [];
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allError[0]?.message || "Validation Error";
    }
    return res
      .status(400)
      .json({ message: firstErrorMessage, error: allError });
  }
  const { name, email, password } = validation.data;
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res
      .status(429)
      .json({ message: "Too many requests, try again later" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;
  const datatoStore = JSON.stringify({
    role: "student",
    name,
    email,
    password: hashPassword,
  });
  await redisClient.set(verifyKey, datatoStore, { EX: 300 });
  const subject = "Verify your email for Student account";
  const html = getVerifyEmailHtml({ email, token: verifyToken });
  sendMail({ email, subject, html }); // remove await
  //👉 Why:
  //Respons will be sent immediately
  //Email runs in background finally improve speed
  //await sendMail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });
  res.json({
    message:
      "If your email is valid, a verification link has been send.it will expire in 5 minutes",
  });
});
//user varification

// Renamed from verifyUser to verifyEmail for clarity
export const verifyEmail = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "verification token is required",
    });
  }

  //verify token is expired or not
  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({
      message: "verification link is expired",
    });
  }

  const userData = JSON.parse(userDataJson);

  // SECURITY FIX: Check for existing user BEFORE deleting the token.
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return res.status(400).json({
      // Don't delete the token, just inform the user.
      // This prevents spamming a user who is already registered.
      message: "User already exists",
    });
  }

  let newUser;
  if (userData.role === "teacher" || userData.role === "student") {
    newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });
    if (userData.role === "teacher") {
      await TeacherProfile.create({
        user: newUser._id,
      });
    } else {
      await StudentProfile.create({
        user: newUser._id,
      });
    }
  } else {
    newUser = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "student",
    });
  }

  // Now that the user is created, delete the verification token
  await redisClient.del(verifyKey);

  //sending message to user
  return res.status(201).json({
    message: "Email verified sucessfully! Your account has been created",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const sanitezedBody = sanitize(req.body);

  const validation = loginSchema.safeParse(sanitezedBody);

  if (!validation.success) {
    //This will automatically tell in which field error is there
    const zodError = validation.error;

    //Above line give a big error In this we are distructuring that whole error
    let firstErrorMessage = "Validation Failed";
    let allError = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));

      firstErrorMessage = allError[0]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allError,
    });
  }

  const { email, password } = validation.data;
  //setting rate limit
  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      //429 status code is for too many requests
      message: "Too many requests, try again later",
    });
  }

  //find user exist or not
  const user = await User.findOne({ email });
  //if email not found
  if (!user) {
    const counterKey = `failed-login:${req.ip}:${email}`;
    const count = await redisClient.incr(counterKey);
    if (count === 1) await redisClient.expire(counterKey, 900);
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  //Comparing user enterd password and existing password in database
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    const counterKey = `failed-login:${req.ip}:${email}`;
    const count = await redisClient.incr(counterKey);
    if (count === 1) await redisClient.expire(counterKey, 900);
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  //cleanup any legacy OTP entries
  await redisClient.del(`otp:${email}`);

  //we are storing 2 tokens refresh token and acesess token
  //1 access token 1 min expiry and getting access
  //2 refresh token 7days expiry from user log in
  // this will keep session alive for 7 days
  // if siggned in from multiple browsers when user logged out from one browser like chrome then he will be logged out from all other browsers

  //generating token after verification
  const tokenData = await generateToken(user._id, user.role, res);

  res.status(200).json({
    message: `welcome ${user.name}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//legacy endpoint for OTP verification
export const verifyOtp = TryCatch(async (req, res) => {
  const { email } = req.body || {};
  if (email) {
    await redisClient.del(`otp:${email}`);
  }
  return res.status(410).json({
    message:
      "OTP verification step removed. Please login with email and password.",
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = req.user;
  res.json({ user });
});

//creating new Api to create access token from refresh token

export const refreshToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Invalid refresh Token",
    });
  }

  //decoding data
  const decode = await verifyRefreshToken(refreshToken);

  if (!decode) {
    return res.status(400).json({
      message: "Invalid refresh Token",
    });
  }

  //if both check point passes then
  const newAccessToken = generateAccessToken(decode.id, decode.role, res);
  res.status(200).json({
    message: "Token refreshed",
    accessToken: newAccessToken,
  });
});

//Log out function
export const logOutUser = TryCatch(async (req, res) => {
  const userId = req.user._id;

  await revokeRefreshToken(userId);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  await redisClient.del(`user:${userId}`);

  res.json({
    message: "Logged out successfully",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { resetToken, password } = req.body;

  if (!resetToken) {
    return res.status(400).json({
      message: "Reset token is required",
    });
  }

  const validation = resetPasswordSchema.safeParse({ password });
  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.issues[0].message,
    });
  }

  const resetTokenKey = `reset_token:${resetToken}`;
  const email = await redisClient.get(resetTokenKey);

  if (!email) {
    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await revokeRefreshToken(user._id);
  await redisClient.del(resetTokenKey);

  res.json({
    message: "Password reset successfully. Please login with new password.",
  });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const validation = forgotPasswordSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.issues[0].message,
    });
  }

  const { email } = validation.data;

  const rateLimitKey = `forgot-pass-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const otpKey = `forgot_otp:${email}`;
  await redisClient.set(otpKey, hashedOtp, { EX: 900 });

  const html = getForgotPasswordHtml({ email, otp });
  await sendMail({ email, subject: "Reset Password OTP", html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message: "OTP sent to your email",
  });
});

export const verifyResetOtp = TryCatch(async (req, res) => {
  const validation = verifyOtpSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: validation.error.issues[0].message,
    });
  }

  const { email, otp } = validation.data;

  const otpKey = `forgot_otp:${email}`;
  const hashedOtp = await redisClient.get(otpKey);

  if (!hashedOtp) {
    return res.status(400).json({
      message: "OTP expired or invalid",
    });
  }

  const isValid = await bcrypt.compare(otp, hashedOtp);
  if (!isValid) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenKey = `reset_token:${resetToken}`;

  await redisClient.set(resetTokenKey, email, { EX: 600 });
  await redisClient.del(otpKey);

  res.json({
    message: "OTP verified",
    resetToken,
  });
});

//Admin Controller functions
export const adminController = TryCatch(async (req, res) => {
  res.json({ message: "Welcome Admin!" });
});
