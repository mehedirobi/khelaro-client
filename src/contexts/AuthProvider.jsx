import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const USER_STORAGE_KEY = "khelaro-user";
const UID_STORAGE_KEY = "khelaro-uid";

const normalizeEmail = (email = "") =>
  String(email).trim().toLowerCase();

const normalizeRole = (role = "user") =>
  String(role).trim().toLowerCase() || "user";

const saveUser = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  if (user?.uid) {
    localStorage.setItem(UID_STORAGE_KEY, user.uid);
  }
};

const clearStoredUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(UID_STORAGE_KEY);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMongoUser = async (email) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/${encodeURIComponent(normalizedEmail)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (response.status === 404) {
        console.warn(
          "MongoDB user profile not found:",
          normalizedEmail
        );
        return null;
      }

      if (!response.ok) {
        console.error(
          "MongoDB user API error:",
          response.status,
          data
        );
        return null;
      }

      const mongoUser = data?.user || data;

      if (!mongoUser?.email) {
        return null;
      }

      const databaseEmail = normalizeEmail(mongoUser.email);

      if (databaseEmail !== normalizedEmail) {
        console.error("Email mismatch:", {
          firebaseEmail: normalizedEmail,
          databaseEmail,
        });

        return null;
      }

      return mongoUser;
    } catch (error) {
      console.error("MongoDB profile fetch failed:", error);
      return null;
    }
  };

  const createFinalUser = (firebaseUser, mongoUser = null) => {
    const email = normalizeEmail(firebaseUser?.email);

    if (!firebaseUser || !email) {
      return null;
    }

    return {
      ...(mongoUser || {}),
      uid: firebaseUser.uid,
      email,
      displayName:
        firebaseUser.displayName ||
        mongoUser?.name ||
        "",
      role: normalizeRole(mongoUser?.role),
    };
  };

  const setAndPersistUser = (user) => {
    if (!user) {
      setCurrentUser(null);
      clearStoredUser();
      return null;
    }

    setCurrentUser(user);
    saveUser(user);

    return user;
  };

  const buildCurrentUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setAndPersistUser(null);
      return null;
    }

    const mongoUser = await getMongoUser(
      firebaseUser.email
    );

    const finalUser = createFinalUser(
      firebaseUser,
      mongoUser
    );

    if (!mongoUser) {
      console.warn(
        "Firebase user exists but MongoDB profile was not found."
      );
    } else {
      console.log("Khelaro user restored:", finalUser);
    }

    return setAndPersistUser(finalUser);
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail) {
        throw new Error("Email is required.");
      }

      const result =
        await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

      await updateProfile(result.user, {
        displayName: name.trim(),
      });

      const mongoUser = await getMongoUser(
        normalizedEmail
      );

      const finalUser = {
        ...(mongoUser || {}),
        uid: result.user.uid,
        name: mongoUser?.name || name.trim(),
        email: normalizedEmail,
        displayName: name.trim(),
        role: normalizeRole(mongoUser?.role),
      };

      setAndPersistUser(finalUser);

      toast.success("Account created successfully!");

      return result.user;
    } catch (error) {
      console.error("Registration error:", error);

      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already registered.");
          break;

        case "auth/weak-password":
          toast.error(
            "Password should be at least 6 characters."
          );
          break;

        case "auth/invalid-email":
          toast.error("Please enter a valid email address.");
          break;

        default:
          toast.error(
            error.message ||
              "Registration failed. Please try again."
          );
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      const normalizedEmail = normalizeEmail(email);

      const result =
        await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

      await buildCurrentUser(result.user);

      toast.success("Login successful!");

      return result.user;
    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          toast.error("Invalid email or password.");
          break;

        case "auth/too-many-requests":
          toast.error(
            "Too many attempts. Please try again later."
          );
          break;

        default:
          toast.error(
            "Login failed. Please try again."
          );
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      setAndPersistUser(null);

      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        "Logout failed. Please try again."
      );

      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          setLoading(true);

          if (!firebaseUser) {
            setAndPersistUser(null);
            return;
          }

          await buildCurrentUser(firebaseUser);
        } catch (error) {
          console.error(
            "Auth state restore error:",
            error
          );

          const fallbackUser = createFinalUser(
            firebaseUser
          );

          setAndPersistUser(fallbackUser);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const authInfo = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;