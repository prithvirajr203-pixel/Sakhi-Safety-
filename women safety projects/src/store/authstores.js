// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getAuth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, isInitialized } from '../config/firebases';

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-disabled': 'This user account has been disabled.',
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account already exists with this email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please log in again to continue.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/invalid-api-key': 'Firebase configuration error. Please check your API key.',
    'auth/configuration-not-found': 'Firebase configuration not found.',
  };
  
  return errorMessages[errorCode] || `Authentication error: ${errorCode}`;
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,
      isFirebaseReady: isInitialized,

      // Set user
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      // Set loading
      setLoading: (isLoading) => set({ isLoading }),
      
      // Set error
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),

      // Login with email/password
      login: async (email, password) => {
        if (!isInitialized) {
          set({ error: 'Firebase not configured. Please check your configuration.', isLoading: false });
          return { success: false, error: 'Firebase not configured' };
        }
        
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          const userData = userDoc.data();
          
          const userObj = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName || userData?.name,
            photoURL: userCredential.user.photoURL,
            phone: userData?.phone,
            role: userData?.role || 'user',
            ...userData
          };
          
          set({ 
            user: userObj, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return { success: true, user: userObj };
        } catch (error) {
          const errorMessage = getAuthErrorMessage(error.code);
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Register new user
      register: async (userData) => {
        if (!isInitialized) {
          set({ error: 'Firebase not configured. Please check your configuration.', isLoading: false });
          return { success: false, error: 'Firebase not configured' };
        }
        
        set({ isLoading: true, error: null });
        try {
          const { email, password, name, phone } = userData;
          
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          // Update profile with name
          if (name) {
            await firebaseUpdateProfile(userCredential.user, { displayName: name });
          }
          
          // Save user data to Firestore
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: email,
            name: name || '',
            phone: phone || '',
            role: 'user',
            createdAt: new Date().toISOString(),
            safetyScore: 85,
            trustedContacts: [],
            reports: [],
            settings: {
              notifications: true,
              autoSOS: true,
              shareLocation: true,
              darkMode: false
            }
          });
          
          const userObj = {
            uid: userCredential.user.uid,
            email: email,
            displayName: name,
            phone: phone,
            role: 'user'
          };
          
          set({ 
            user: userObj, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return { success: true, user: userObj };
        } catch (error) {
          console.error('Register error:', error);
          const errorMessage = getAuthErrorMessage(error.code);
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Reset Password
      resetPassword: async (email) => {
        if (!isInitialized) {
          set({ error: 'Firebase not configured. Please check your configuration.', isLoading: false });
          return { success: false, error: 'Firebase not configured' };
        }
        
        set({ isLoading: true, error: null });
        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = getAuthErrorMessage(error.code);
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Google Login
      googleLogin: async () => {
        if (!isInitialized) {
          set({ error: 'Firebase not configured. Please check your configuration.', isLoading: false });
          return { success: false, error: 'Firebase not configured' };
        }
        
        set({ isLoading: true, error: null });
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          
          // Check if user exists in Firestore, if not create
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
              uid: result.user.uid,
              email: result.user.email,
              name: result.user.displayName || '',
              phone: result.user.phoneNumber || '',
              role: 'user',
              createdAt: new Date().toISOString(),
              safetyScore: 85,
              trustedContacts: [],
              reports: []
            });
          }
          
          set({ 
            user: result.user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return { success: true, user: result.user };
        } catch (error) {
          console.error('Google login error:', error);
          const errorMessage = getAuthErrorMessage(error.code);
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Update Profile
      updateProfile: async (profileData) => {
        if (!isInitialized || !get().user) {
          set({ error: 'User not authenticated or Firebase not configured.', isLoading: false });
          return { success: false, error: 'User not authenticated' };
        }
        
        set({ isLoading: true, error: null });
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await firebaseUpdateProfile(currentUser, profileData);
          }
          
          // Update Firestore
          const userRef = doc(db, 'users', get().user.uid);
          await updateDoc(userRef, profileData);
          
          // Update user in state
          const updatedUser = { ...get().user, ...profileData };
          set({ user: updatedUser, isLoading: false });
          
          return { success: true, user: updatedUser };
        } catch (error) {
          console.error('Update profile error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Update Settings
      updateSettings: async (settings) => {
        if (!isInitialized || !get().user) {
          set({ error: 'User not authenticated or Firebase not configured.', isLoading: false });
          return { success: false, error: 'User not authenticated' };
        }
        
        set({ isLoading: true, error: null });
        try {
          const userRef = doc(db, 'users', get().user.uid);
          await updateDoc(userRef, { settings });
          
          // Update user settings in state
          const updatedUser = { ...get().user, settings };
          set({ user: updatedUser, isLoading: false });
          
          return { success: true };
        } catch (error) {
          console.error('Update settings error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Upload Profile Photo
      uploadProfilePhoto: async (file) => {
        if (!isInitialized || !get().user) {
          set({ error: 'User not authenticated or Firebase not configured.', isLoading: false });
          return { success: false, error: 'User not authenticated' };
        }
        
        set({ isLoading: true, error: null });
        try {
          const storageRef = ref(storage, `profile-photos/${get().user.uid}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          // Update profile with photo URL
          const currentUser = auth.currentUser;
          if (currentUser) {
            await firebaseUpdateProfile(currentUser, { photoURL: downloadURL });
          }
          
          // Update Firestore
          const userRef = doc(db, 'users', get().user.uid);
          await updateDoc(userRef, { photoURL: downloadURL });
          
          // Update user in state
          const updatedUser = { ...get().user, photoURL: downloadURL };
          set({ user: updatedUser, isLoading: false });
          
          return { success: true, photoURL: downloadURL };
        } catch (error) {
          console.error('Upload photo error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Initialize auth listener
      initAuthListener: () => {
        if (!isInitialized) {
          console.warn('Firebase not initialized, auth features disabled');
          set({ isLoading: false });
          return () => {};
        }
        
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Get additional user data from Firestore
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              const userData = userDoc.data();
              
              set({ 
                user: {
                  ...user,
                  phone: userData?.phone,
                  role: userData?.role || 'user',
                  settings: userData?.settings,
                  ...userData
                }, 
                isAuthenticated: true, 
                isLoading: false 
              });
            } catch (error) {
              console.error('Error fetching user data:', error);
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
            }
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        });
        
        return unsubscribe;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user ? {
          uid: state.user.uid,
          email: state.user.email,
          displayName: state.user.displayName,
          photoURL: state.user.photoURL,
          emailVerified: state.user.emailVerified,
          phone: state.user.phone,
          role: state.user.role
        } : null,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export { useAuthStore };
