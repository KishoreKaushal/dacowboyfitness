import { ref, computed } from 'vue'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

// Global shared state
const currentUser = ref<User | null>(null)
const isLoading = ref<boolean>(true)
const isAuthSigningIn = ref<boolean>(false)
const authError = ref<string | null>(null)

const isAuthModalOpen = ref<boolean>(false)
const isProfileDrawerOpen = ref<boolean>(false)

let isInitialized = false

// Non-blocking profile synchronization to Firestore
function syncUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid)
  setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  ).catch((err) => {
    console.error('Failed to sync user profile:', err)
  })
}

function initAuthListener() {
  if (isInitialized) return
  isInitialized = true

  // Check for redirect result on load
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        syncUserProfile(result.user)
      }
    })
    .catch((err) => {
      console.error('Redirect sign-in error:', err)
    })

  // Listen for Auth state changes
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    isLoading.value = false

    if (user) {
      // Instantly dismiss modal and stop signing-in spinner
      isAuthSigningIn.value = false
      isAuthModalOpen.value = false
      // Background sync profile
      syncUserProfile(user)
    }
  })
}

export function useAuth() {
  initAuthListener()

  const isAuthenticated = computed(() => !!currentUser.value)

  const openAuthModal = () => {
    authError.value = null
    isAuthModalOpen.value = true
  }

  const closeAuthModal = () => {
    if (!isAuthSigningIn.value) {
      isAuthModalOpen.value = false
      authError.value = null
    }
  }

  const openProfileDrawer = () => {
    isProfileDrawerOpen.value = true
  }

  const closeProfileDrawer = () => {
    isProfileDrawerOpen.value = false
  }

  const toggleProfileDrawer = () => {
    isProfileDrawerOpen.value = !isProfileDrawerOpen.value
  }

  async function signInWithGoogle() {
    isAuthSigningIn.value = true
    authError.value = null

    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result?.user) {
        currentUser.value = result.user
        isAuthSigningIn.value = false
        isAuthModalOpen.value = false
        syncUserProfile(result.user)
      }
    } catch (err: any) {
      console.error('Sign-in error:', err)
      isAuthSigningIn.value = false

      if (err.code === 'auth/popup-closed-by-user') {
        authError.value = 'Sign-in window was closed. Please try again.'
      } else if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (redirectErr: any) {
          authError.value = redirectErr.message || 'Popup was blocked and redirect failed.'
        }
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain'
        authError.value = `Domain (${domain}) is not authorized in Firebase Console. Please add ${domain} to Authorized Domains in Firebase Console.`
      } else if (err.code === 'auth/configuration-not-found') {
        authError.value = 'Google Sign-In is not enabled in Firebase Console. Please enable Google provider under Authentication -> Sign-in method.'
      } else {
        authError.value = err.message || 'Failed to sign in with Google. Please try again.'
      }
    }
  }

  async function signOutUser() {
    try {
      await firebaseSignOut(auth)
      currentUser.value = null
      isProfileDrawerOpen.value = false
      isAuthModalOpen.value = false
    } catch (err: any) {
      console.error('Sign-out error:', err)
    }
  }

  return {
    currentUser,
    isLoading,
    isAuthSigningIn,
    authError,
    isAuthenticated,
    isAuthModalOpen,
    isProfileDrawerOpen,
    openAuthModal,
    closeAuthModal,
    openProfileDrawer,
    closeProfileDrawer,
    toggleProfileDrawer,
    signInWithGoogle,
    signOutUser
  }
}
