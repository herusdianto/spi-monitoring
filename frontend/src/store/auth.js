import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { getFirebaseAuth, observeAuth } from '@/config/firebase';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const idToken = ref(null);
  const loading = ref(true);
  const isInitialized = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!user.value && !!idToken.value);

  async function initialize() {
    return new Promise((resolve) => {
      const auth = getFirebaseAuth();
      
      const unsubscribe = observeAuth(async (firebaseUser) => {
        if (firebaseUser) {
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          };
          
          try {
            const token = await firebaseUser.getIdToken();
            idToken.value = token;
            api.setToken(token);
          } catch (err) {
            console.error('Failed to get ID token:', err);
          }
        } else {
          user.value = null;
          idToken.value = null;
        }
        
        loading.value = false;
        isInitialized.value = true;
        unsubscribe();
        resolve();
      });
    });
  }

  async function login(email, password) {
    error.value = null;
    loading.value = true;
    
    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
      
      const token = await userCredential.user.getIdToken();
      idToken.value = token;
      api.setToken(token);
      
      return true;
    } catch (err) {
      error.value = getErrorMessage(err.code);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(email, password, displayName) {
    error.value = null;
    loading.value = true;
    
    try {
      const auth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      user.value = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      };
      
      const token = await userCredential.user.getIdToken();
      idToken.value = token;
      api.setToken(token);
      
      return true;
    } catch (err) {
      error.value = getErrorMessage(err.code);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    error.value = null;
    loading.value = true;
    
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      
      user.value = null;
      idToken.value = null;
      api.setToken(null);
      
      return true;
    } catch (err) {
      error.value = 'Failed to sign out';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function getErrorMessage(code) {
    const messages = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-disabled': 'User account has been disabled',
      'auth/user-not-found': 'No user found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    };
    
    return messages[code] || 'An error occurred. Please try again';
  }

  return {
    user,
    idToken,
    loading,
    isInitialized,
    error,
    isAuthenticated,
    initialize,
    login,
    register,
    logout
  };
});