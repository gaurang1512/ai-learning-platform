# Deployment Environment Variables Template

## Backend - .env File
```
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=production

# ============================================
# DATABASE
# ============================================
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/MERNAuthentication?retryWrites=true&w=majority

# ============================================
# CACHING (Redis)
# ============================================
REDIS_URL=redis://default:password@host:port

# ============================================
# JWT AUTHENTICATION
# ============================================
ACCESS_TOKEN_SECRET=your-secret-key-must-be-at-least-32-characters-long
REFRESH_TOKEN_SECRET=your-refresh-secret-key-must-be-at-least-32-characters-long
ACCESS_TOKEN_EXPIRY=1m
REFRESH_TOKEN_EXPIRY=7d
COOKIE_EXPIRY=7

# ============================================
# EMAIL CONFIGURATION
# ============================================
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=app-specific-password-from-google
EMAIL_FROM_NAME=Your App Name
EMAIL_PROVIDER=gmail

# For SendGrid instead:
# SENDGRID_API_KEY=SG.your-api-key

# ============================================
# FRONTEND CONFIGURATION
# ============================================
CLIENT_URL=https://your-frontend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com

# ============================================
# AI SERVICE (if using Groq)
# ============================================
GROQ_API_KEY=your-groq-api-key-here

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend - .env.production File
```
# ============================================
# API CONFIGURATION
# ============================================
VITE_API_URL=https://your-app-backend.onrender.com

# ============================================
# APP CONFIGURATION
# ============================================
VITE_APP_NAME=Your App Name
VITE_APP_VERSION=1.0.0

# ============================================
# FEATURE FLAGS
# ============================================
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=false
```

## How to Generate Secure Secrets

### Generate JWT Secrets (Linux/Mac/WSL)
```bash
# Generate a 32-character random string
openssl rand -base64 32
```

### Generate JWT Secrets (Windows PowerShell)
```powershell
# Generate a 32-character random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Or use Node.js
```javascript
// Run this in Node.js console or create a file
require('crypto').randomBytes(32).toString('hex');
```

---

## Platform-Specific Instructions

### For Render
1. Go to your Web Service
2. Click **Environment**
3. Paste variables here
4. Auto service restarts

### For Railway
1. Go to **Variables**
2. Add each key-value pair
3. Auto redeploys

### For Vercel (Frontend)
1. Go to **Settings → Environment Variables**
2. Enter variable name and value
3. Select appropriate environment (Production, Preview, Development)
4. Redeploy to apply

### For Netlify (Frontend)
1. Go to **Site Settings → Build & Deploy → Environment**
2. Click **Edit Variables**
3. Add variables
4. Trigger new build

### For GitHub Secrets (for CI/CD)
```bash
# Via GitHub CLI
gh secret set MONGO_URI --body "your-connection-string"

# Or via GitHub Web UI
# Go to Settings → Secrets and variables → Actions
```

---

## Security Best Practices

✅ **DO**:
- Use strong, randomly generated secrets
- Keep secrets out of git (add .env to .gitignore)
- Use different secrets for dev/staging/production
- Rotate secrets regularly
- Store in secure secret management (vault, 1Password, etc.)

❌ **DON'T**:
- Commit .env files
- Share secrets in emails or Slack
- Use same secret across environments
- Use predictable strings
- Hardcode secrets in code

---

## Verification Checklist

After adding environment variables:

- [ ] Backend connects to MongoDB: Test on `/health`
- [ ] Redis connects successfully: Check logs
- [ ] Emails are sent: Try registration
- [ ] JWT tokens work: Check browser cookies
- [ ] CORS works: No errors in console
- [ ] API responses return data: Test an API endpoint
- [ ] Frontend loads: No 404 errors
