
# Firebase & Google Sign-in Setup Guide for Ethiopay

This guide will help you set up Firebase Authentication and Google Sign-in for your Ethiopay app.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Expo CLI installed

## 🔥 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `ethiopay` (or your preferred name)
4. Disable Google Analytics (optional, you can enable it later)
5. Click "Create project"

## 🔧 Step 2: Register Your App with Firebase

### For Web/Expo:
1. In Firebase Console, click the **Web icon** (</>) to add a web app
2. Register app with nickname: `Ethiopay Web`
3. Copy the Firebase configuration object

### For iOS (if needed):
1. Click the **iOS icon** to add an iOS app
2. Enter iOS bundle ID (from your app.json)
3. Download `GoogleService-Info.plist`

### For Android (if needed):
1. Click the **Android icon** to add an Android app
2. Enter Android package name (from your app.json)
3. Download `google-services.json`

## 🔑 Step 3: Update Firebase Configuration

Open `config/firebase.ts` and replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## 🔐 Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click "Enable" toggle
   - **Google**: Click "Enable" toggle
     - Enter project support email
     - Save

## 🌐 Step 5: Set Up Google OAuth

### Create OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (or create new project)
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**

### For Web Application:
1. Application type: **Web application**
2. Name: `Ethiopay Web Client`
3. Authorized JavaScript origins:
   - `http://localhost:19006` (for local development)
   - `https://auth.expo.io` (for Expo)
4. Authorized redirect URIs:
   - `https://auth.expo.io/@your-username/your-app-slug`
5. Click **Create**
6. Copy the **Client ID**

### For iOS Application:
1. Application type: **iOS**
2. Name: `Ethiopay iOS Client`
3. Bundle ID: Your iOS bundle ID from `app.json`
4. Click **Create**
5. Copy the **Client ID**

### For Android Application:
1. Application type: **Android**
2. Name: `Ethiopay Android Client`
3. Package name: Your Android package from `app.json`
4. SHA-1 certificate fingerprint:
   ```bash
   # For development, get SHA-1 from:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
5. Click **Create**
6. Copy the **Client ID**

## 📱 Step 6: Update Google Sign-in Configuration

Open `app/auth/index.tsx` and update the Google OAuth configuration:

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

## 🔒 Step 7: Configure Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Start in **Test mode** (for development)
4. Choose a location (closest to your users)
5. Click **Enable**

### Set up Security Rules (for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Wallets collection
    match /wallets/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📝 Step 8: Update app.json (if needed)

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "ethiopay",
    "ios": {
      "bundleIdentifier": "com.yourcompany.ethiopay",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.yourcompany.ethiopay",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

## 🧪 Step 9: Test Authentication

### Test Phone + OTP (Demo):
- Use any phone number
- OTP: `123456`

### Test Email/Password:
1. Create account with email and password
2. Login with same credentials

### Test Google Sign-in:
1. Click "Continue with Google"
2. Select Google account
3. Grant permissions
4. Should redirect back to app

## 🚀 Step 10: Run Your App

```bash
# Start Expo development server
npm run dev

# Or for specific platform
npm run ios
npm run android
npm run web
```

## 🔍 Troubleshooting

### Google Sign-in not working:
- Verify all Client IDs are correct
- Check that redirect URIs are properly configured
- Ensure Google provider is enabled in Firebase Console
- Check console logs for specific error messages

### Firebase connection issues:
- Verify Firebase config values are correct
- Check internet connection
- Ensure Firebase project is active

### Firestore permission errors:
- Update Firestore security rules
- Verify user is authenticated before accessing Firestore

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Authentication Guide](https://docs.expo.dev/guides/authentication/)
- [Google Sign-in for Expo](https://docs.expo.dev/guides/google-authentication/)

## 🔐 Security Best Practices

1. **Never commit Firebase config with real credentials to public repos**
2. Use environment variables for sensitive data in production
3. Enable App Check for additional security
4. Set up proper Firestore security rules
5. Enable email verification for new accounts
6. Implement rate limiting for authentication attempts

## 💡 Next Steps

After setup is complete:
- Test all authentication methods
- Set up email verification
- Configure password reset functionality
- Add biometric authentication
- Implement PIN security
- Set up transaction notifications

---

Need help? Check the Firebase Console for detailed error messages and logs.
