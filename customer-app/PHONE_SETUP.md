# 📱 Physical Phone Setup Guide

## ✅ Prerequisites Completed
- ✅ Developer Mode ON
- ✅ API URL Updated: `http://10.164.155.177:8080/api/v1`

## 🔧 Next Steps

### Step 1: USB Debugging Enable Karo

Phone me:
1. `Settings` → `Developer options`
2. **USB debugging** ON karo
3. **USB debugging (Security settings)** bhi ON karo (agar option ho)

### Step 2: Phone Connect Karo

1. USB cable se phone ko PC se connect karo
2. Phone pe prompt aayega "Allow USB debugging?" → **Allow** select karo
3. "Always allow from this computer" check karo (optional but recommended)

### Step 3: Verify Connection

PC pe PowerShell me:

```bash
adb devices
```

**Expected Output:**
```
List of devices attached
XXXXXXXXX    device
```

Agar `unauthorized` dikhe to phone pe dubara **Allow** karo.

### Step 4: Backend Start Karo

**Terminal 1 - Backend:**

```bash
cd backend
mvn spring-boot:run
```

Ya agar jar file hai:
```bash
java -jar target/food-delivery-0.0.1-SNAPSHOT.jar
```

**Important:** Backend `http://10.164.155.177:8080` par accessible hona chahiye.

### Step 5: Metro Bundler Start Karo

**Terminal 2 - Metro:**

```bash
cd customer-app
npx react-native start
```

Ye terminal **open rakho**.

### Step 6: App Phone Pe Install Karo

**Terminal 3 - Run App:**

```bash
cd customer-app
npx react-native run-android
```

Ye command:
- App build karega
- Phone pe install karega
- App automatically open ho jayegi

## 🔍 Troubleshooting

### Issue: `adb devices` me phone nahi dikh raha

**Solutions:**
1. USB cable change karo
2. Phone me USB mode check karo (File Transfer mode select karo)
3. PC me USB drivers install karo (phone manufacturer ke website se)
4. `adb kill-server` then `adb start-server` run karo

### Issue: Backend connection error

**Check:**
1. Backend running hai? (`http://localhost:8080` pe check karo browser me)
2. Windows Firewall me port 8080 allow hai?
3. Phone aur PC same Wi-Fi network pe hain?
4. API URL sahi hai? (`http://10.164.155.177:8080/api/v1`)

### Issue: App build fail ho raha hai

**Solutions:**
```bash
cd customer-app/android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue: Metro bundler connection error

**Solution:**
1. Phone me **Shake gesture** karo (ya volume up + power button)
2. **Dev Settings** → **Debug server host & port**
3. Enter: `10.164.155.177:8081`
4. App reload karo

## ✅ Success Checklist

- [ ] Phone `adb devices` me dikh raha hai
- [ ] Backend running hai (`http://localhost:8080`)
- [ ] Metro bundler running hai
- [ ] App phone pe install ho gayi
- [ ] App open ho gayi
- [ ] API calls working hain (menu load ho raha hai)

## 🎯 Testing

App open hone ke baad:
1. Splash screen dikhega
2. Menu screen pe navigate hoga
3. Menu items load honge (agar backend me data hai)

Agar menu items nahi dikh rahe to:
- Backend me menu data add karo
- Ya API endpoint test karo: `http://10.164.155.177:8080/api/v1/public/menu`

---

**Ready?** Ab step by step follow karo! 🚀






