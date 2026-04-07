# Quick Deployment Checklist & Testing Guide

## 🚀 Pre-Deployment Checklist

### Code Cleanup

- [ ] Remove console.logs from production code
- [ ] Update API URLs from localhost to production
- [ ] Verify all environment variables are set
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Delete unused dependencies
- [ ] Update .gitignore (includes .env files)

### Backend Preparation

- [ ] Health check endpoint works: `GET /health`
- [ ] CORS is properly configured
- [ ] All environment variables documented
- [ ] Database connection tested
- [ ] Redis connection tested
- [ ] Email service tested
- [ ] Error handling is in place

### Frontend Preparation

- [ ] API interceptor points to backend URL
- [ ] Build succeeds: `npm run build`
- [ ] No console errors or warnings
- [ ] Bundle size is reasonable (< 500KB)
- [ ] All pages are accessible
- [ ] Image optimizations applied

### Database

- [ ] MongoDB backup created
- [ ] Database user has proper permissions
- [ ] Connection string is correct
- [ ] IP whitelist configured

### Security

- [ ] No API keys in code
- [ ] No passwords in code
- [ ] HTTPS configured
- [ ] CORS restricted to your domain
- [ ] rate limiting enabled

---

## 📊 Deployment Checklist

### Step 1: Deploy Backend (Render)

- [ ] Push code to GitHub
- [ ] Create new Web Service on Render
- [ ] Configure build & start commands
- [ ] Add all environment variables
- [ ] Wait for deployment to complete
- [ ] Test health endpoint

### Step 2: Deploy Frontend (Vercel)

- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings (base: frontend, output: dist)
- [ ] Add VITE_API_URL environment variable
- [ ] Wait for deployment
- [ ] Test if app loads

### Step 3: Verify Integration

- [ ] Frontend and backend communicate successfully
- [ ] CORS errors are gone
- [ ] Cookies are being set
- [ ] API calls work

---

## ✅ Post-Deployment Testing

### Test 1: Backend Health Check

```bash
# Should return 200 OK
curl https://your-backend.onrender.com/health
```

### Test 2: Frontend Loads

```bash
# Open in browser
https://your-app.vercel.app
# Check browser console for errors
# Open DevTools (F12) to verify no 404s
```

### Test 3: User Registration

**Steps**:

1. Click "Register" on the app
2. Enter a test email
3. Verify email was sent (check email inbox)
4. Click verification link in email
5. Create password
6. Should redirect to login

**Verification**:

- [ ] Email received
- [ ] Link works
- [ ] Account created
- [ ] Can login with new credentials

### Test 4: Login & Token Refresh

**Steps**:

1. Login with test account
2. Wait for access token to expire (1 minute)
3. Make an API call
4. Should automatically refresh token

**Verification**:

- [ ] Cookies set in browser
- [ ] Access token is `1m`
- [ ] Refresh token is `7d`
- [ ] Auto-refresh works without re-login

### Test 5: Protected Routes

**Steps**:

1. Login successfully
2. Access protected page (Dashboard, etc.)
3. Open DevTools → Network
4. Check Authorization header in requests

**Verification**:

- [ ] Can access protected pages
- [ ] Token appears in Authorization header
- [ ] No 401 Unauthorized errors unless token expired

### Test 6: CORS Configuration

**Steps**:

1. Open DevTools → Console
2. Check for "Access-Control-Allow-Origin" errors

**Should see**:

```
✅ No CORS errors
✅ Requests include credential headers
```

### Test 7: Database Connection

**Backend logs should show**:

```
MongoDB connected successfully
```

**Test query**:

```bash
# Your user should be in database
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.onrender.com/api/user/profile
```

### Test 8: Email Service

**Steps**:

1. Register a new account
2. Check if verification email arrives (check spam)
3. Verify subject, sender, and content

**Verification**:

- [ ] Email received within 30 seconds
- [ ] Email from correct sender
- [ ] Verification link works
- [ ] No email errors in backend logs

### Test 9: Mobile Responsiveness

**Steps**:

1. Open frontend in DevTools responsive mode
2. Test on iPhone SE, iPad, Galaxy S21
3. Check all pages load correctly

**Verification**:

- [ ] No layout breaks
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Forms work

---

## 🐛 Debugging Commands

### Check Render Logs

```bash
# Visit Render dashboard → Logs tab
# Or use Render's log streaming API
```

### Check Vercel Logs

```bash
# Visit Vercel dashboard → Deployments → Functions
# Click your deployment to see real-time logs
```

### Test MongoDB Connection

```javascript
// Create a test file on Node.js console
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
// If successful, you'll see connection message
```

### Test Redis Connection

```javascript
// Using Node.js redis client
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
client.ping(); // Should return PONG
```

### Test Email

```javascript
// Test from Node.js
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({...});
transporter.sendMail({...}); // Should succeed
```

---

## 📈 Performance Testing

### Frontend Performance

```bash
# Audit build size
npm run build
# Check dist folder size (should be < 500KB)

# View bundle analysis
# Use: npm install -g vite
# Then: vite --analyze
```

### Backend Performance

1. Use Apollo DevTools or similar
2. Monitor response times: should be < 200ms
3. Check database query performance

### Load Testing (Optional)

```bash
# Using Apache Bench
ab -n 100 -c 10 https://your-backend.onrender.com/health

# Using wrk
wrk -t4 -c100 -d10s https://your-backend.onrender.com/health
```

---

## 🆘 Troubleshooting

### Issue: Deployment Fails

**Check**:

- [ ] Build command correct: `npm install && npm run build`
- [ ] No syntax errors: Run locally first
- [ ] All dependencies in package.json
- [ ] Node version compatible
- [ ] Sufficient resources allocated

### Issue: CORS Errors

**Solution**:

```javascript
// Verify CORS_ORIGIN matches exactly
// ❌ https://app.com vs https://www.app.com
// Must match exactly
console.log("Expected:", process.env.CORS_ORIGIN);
```

### Issue: Database 404

**Check**:

- [ ] MONGO_URI is correct
- [ ] IP whitelist includes server IP
- [ ] Database credentials correct
- [ ] MongoDB Atlas cluster is running

### Issue: Tokens Not Working

**Check**:

- [ ] Cookie-parser installed and configured
- [ ] withCredentials: true in axios
- [ ] CORS allows credentials
- [ ] HTTPS enforced (cookies need secure flag)

### Issue: Email Not Sending

**Check**:

- [ ] Email credentials correct
- [ ] Gmail: 2FA enabled + app password
- [ ] SendGrid: API key valid
- [ ] Email address format valid
- [ ] Check spam folder

### Issue: High Memory Usage

**Solution**:

- Increase instance size on Render/Railway
- Check for memory leaks in code
- Limit Redis key expiruation

---

## 📞 Getting Help

### Check Logs First

1. **Backend Logs**: Render/Railway dashboard
2. **Frontend Logs**: Browser DevTools
3. **Database Logs**: MongoDB Atlas dashboard

### Compare with Local

1. Run locally: `npm run dev`
2. Test same flow
3. Compare behavior
4. Check error messages

### Ask for Help With Info

- [ ] Exact error message
- [ ] Logs from console
- [ ] Steps to reproduce
- [ ] Screenshots
- [ ] Your environment variables (without secrets!)

---

## ✨ Performance Optimization (Optional)

### Backend Optimizations

```javascript
// Add caching
app.use(redis - cache);

// Compress responses
import compression from "compression";
app.use(compression());

// Add rate limiting
app.use(rateLimit);
```

### Frontend Optimizations

```javascript
// Code splitting
const LazyComponent = lazy(() => import('./Component'));

// Image optimization
import { Image } from 'next/image'; // or similar

// Bundle size reduction
npm list --depth=0 // Find large dependencies
```

---

## 🎓 Learning Resources

- **Monitoring**:
  - Sentry: Error tracking
  - LogRocket: Session replay
  - NewRelic: Performance monitoring

- **CI/CD**:
  - GitHub Actions
  - GitLab CI
  - CircleCI

- **Infrastructure**:
  - Docker: Containerization
  - Kubernetes: Orchestration
  - Terraform: Infrastructure as Code

---

## 📋 Final Checklist

Before marking as "Production Ready":

- [ ] All tests pass
- [ ] Performance is acceptable
- [ ] Security issues resolved
- [ ] Error handling in place
- [ ] Monitoring set up
- [ ] Backup strategy defined
- [ ] Scalability plan ready
- [ ] Team trained on deployment
- [ ] Documentation updated
- [ ] Go-live communication sent

---

**Deployment Status**: Ready to Deploy ✅
**Last Updated**: 2026-04-07
