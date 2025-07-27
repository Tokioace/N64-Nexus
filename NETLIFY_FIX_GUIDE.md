# 🔧 NETLIFY BRANCH FIX - iPhone Guide

## 🚨 **Problem:** 
Netlify is deploying from the wrong branch and showing placeholder text instead of the completed translations.

## ✅ **Solution:** Fix the deployment branch

---

## 📱 **iPhone Steps to Fix:**

### **Step 1: Check Current Netlify Settings**
1. **Open Safari on iPhone**
2. **Go to:** `https://app.netlify.com`
3. **Login** to your account
4. **Find your N64-Nexus site**
5. **Tap "Site settings"**

### **Step 2: Fix the Branch**
1. **Tap "Build & deploy"**
2. **Tap "Continuous deployment"**
3. **Look for "Branch to deploy"**
4. **Current setting:** Probably `main` or an old branch
5. **Change to:** `main` (if not already)

### **Step 3: Force Redeploy**
1. **Go back to site overview**
2. **Tap "Deploys"**
3. **Tap "Trigger deploy"**
4. **Select "Deploy site"**

---

## 🎯 **Alternative: Redeploy from GitHub**

### **Option A: Disconnect & Reconnect**
1. **Netlify → Site settings**
2. **Build & deploy → Link repository**
3. **Tap "Unlink repository"**
4. **Tap "Link to Git provider"**
5. **Select GitHub → N64-Nexus**
6. **Branch:** `main`
7. **Build command:** `npm run build`
8. **Publish directory:** `dist`

### **Option B: Manual Trigger**
1. **Netlify dashboard**
2. **Your site → Deploys**
3. **Tap "Trigger deploy"**
4. **"Clear cache and deploy site"**

---

## 🔍 **How to Verify Fix:**

### **Check the Build Log:**
1. **Netlify → Deploys**
2. **Tap latest deploy**
3. **Check build log shows:**
   ```
   ✓ 1721 modules transformed
   ✓ built in ~3s
   ```

### **Check the Live Site:**
1. **Open your Netlify URL**
2. **Language selector should work**
3. **No "placeholder" text**
4. **All 13 languages available**

---

## 🎮 **Expected Result:**

After the fix, your site should show:
- ✅ **Battle64 N64 Community** (not placeholder)
- ✅ **Language selector** with 13 flags
- ✅ **Proper German/English/etc** text
- ✅ **No "Fanart Subtitle" or similar placeholders**

---

## 🚨 **If Still Not Working:**

### **Quick Debug:**
1. **Check commit hash in Netlify**
2. **Should be:** `b0a98e8` or `10edfe8`
3. **If different:** Wrong branch/commit

### **Nuclear Option:**
1. **Delete the Netlify site**
2. **Create new site from Git**
3. **Select GitHub → N64-Nexus**
4. **Branch:** `main`
5. **Build:** `npm run build`
6. **Publish:** `dist`

---

## 🏆 **Success Indicators:**

When fixed, you'll see:
- 🌍 **13 language flags** in header
- 🎮 **"N64 Battle64 Community"** title
- 🏁 **"Speedrun Events"** (not "Event Title")
- 🎨 **"Fan Art Gallery"** (not "Fanart Subtitle")
- 💬 **"Community Forum"** (not "Forum Title")

**The placeholder text should be completely gone!** ✨