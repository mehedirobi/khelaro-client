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

// =====================================================
// API CONFIG
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// =====================================================
// AUTH PROVIDER
// =====================================================

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // GET USER PROFILE FROM MONGODB
  // ===================================================

  const getMongoUser = async (email) => {
    if (!email) {
      throw new Error("Firebase user email not found.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const url = `${API_URL}/users/${encodeURIComponent(
      normalizedEmail
    )}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // -----------------------------------------------
      // USER NOT FOUND
      // -----------------------------------------------

      if (response.status === 404) {
        console.warn(
          "MongoDB user profile not found:",
          normalizedEmail
        );

        return null;
      }

      // -----------------------------------------------
      // OTHER SERVER ERROR
      // -----------------------------------------------

      if (!response.ok) {
        console.error(
          "MongoDB user API error:",
          response.status,
          data
        );

        return null;
      }

      // -----------------------------------------------
      // BACKEND RESPONSE
      // -----------------------------------------------

      const mongoUser = data?.user || data;

      if (!mongoUser?.email) {
        return null;
      }

      // -----------------------------------------------
      // VERIFY EMAIL
      // -----------------------------------------------

      const databaseEmail = mongoUser.email
        .trim()
        .toLowerCase();

      if (databaseEmail !== normalizedEmail) {
        console.error("Email mismatch:", {
          firebaseEmail: normalizedEmail,
          databaseEmail,
        });

        return null;
      }

      return mongoUser;
    } catch (error) {
      console.error(
        "MongoDB profile fetch failed:",
        error
      );

      return null;
    }
  };

  // ===================================================
  // BUILD FINAL USER
  // ===================================================

  const buildCurrentUser = async (firebaseUser) => {
    if (!firebaseUser) {
      setCurrentUser(null);

      localStorage.removeItem("khelaro-user");
      localStorage.removeItem("khelaro-uid");

      return null;
    }

    const firebaseEmail = firebaseUser.email
      ?.trim()
      .toLowerCase();

    // -----------------------------------------------
    // GET MONGODB PROFILE
    // -----------------------------------------------

    const mongoUser = await getMongoUser(firebaseEmail);

    // -----------------------------------------------
    // IF MONGODB PROFILE EXISTS
    // -----------------------------------------------

    if (mongoUser) {
      const role = String(
        mongoUser.role || "user"
      )
        .trim()
        .toLowerCase();

      const finalUser = {
        ...mongoUser,

        // Firebase data
        uid: firebaseUser.uid,
        email: firebaseEmail,
        displayName:
          firebaseUser.displayName ||
          mongoUser.name ||
          "",

        // MongoDB role
        role,
      };

      // ---------------------------------------------
      // SAVE LOCAL USER
      // ---------------------------------------------

      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(finalUser)
      );

      localStorage.setItem(
        "khelaro-uid",
        firebaseUser.uid
      );

      setCurrentUser(finalUser);

      console.log(
        "Khelaro user restored:",
        finalUser
      );

      return finalUser;
    }

    // =================================================
    // FALLBACK
    // =================================================
    //
    // Firebase account exists but MongoDB profile
    // does not exist.
    //
    // We DON'T give admin/owner role here.
    // Default role is user.
    // =================================================

    const fallbackUser = {
      uid: firebaseUser.uid,
      email: firebaseEmail,
      displayName:
        firebaseUser.displayName || "",
      role: "user",
    };

    setCurrentUser(fallbackUser);

    localStorage.setItem(
      "khelaro-user",
      JSON.stringify(fallbackUser)
    );

    localStorage.setItem(
      "khelaro-uid",
      firebaseUser.uid
    );

    console.warn(
      "Firebase user exists but MongoDB profile was not found."
    );

    return fallbackUser;
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      setLoading(true);

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      // -----------------------------------------------
      // CREATE FIREBASE USER
      // -----------------------------------------------

      const result =
        await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

      // -----------------------------------------------
      // UPDATE FIREBASE PROFILE
      // -----------------------------------------------

      await updateProfile(result.user, {
        displayName: name,
      });

      // -----------------------------------------------
      // IMPORTANT
      // -----------------------------------------------
      //
      // MongoDB registration should create the user
      // profile with:
      //
      // role: "user"
      //
      // or:
      //
      // role: "owner"
      //
      // depending on your Register page.
      //
      // -----------------------------------------------

      const mongoUser = await getMongoUser(
        normalizedEmail
      );

      const finalUser = {
        ...(mongoUser || {}),

        uid: result.user.uid,
        name:
          mongoUser?.name ||
          name,
        email: normalizedEmail,
        displayName: name,
        role:
          mongoUser?.role ||
          "user",
      };

      setCurrentUser(finalUser);

      localStorage.setItem(
        "khelaro-user",
        JSON.stringify(finalUser)
      );

      localStorage.setItem(
        "khelaro-uid",
        result.user.uid
      );

      toast.success(
        "Account created successfully!"
      );

      return result.user;
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        toast.error(
          "This email is already registered."
        );
      } else if (
        error.code ===
        "auth/weak-password"
      ) {
        toast.error(
          "Password should be at least 6 characters."
        );
      } else if (
        error.code ===
        "auth/invalid-email"
      ) {
        toast.error(
          "Please enter a valid email address."
        );
      } else {
        toast.error(
          "Registration failed. Please try again."
        );
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (
    email,
    password
  ) => {
    try {
      setLoading(true);

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      // -----------------------------------------------
      // FIREBASE LOGIN
      // -----------------------------------------------

      const result =
        await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

      // -----------------------------------------------
      // GET MONGODB USER
      // -----------------------------------------------

      const mongoUser =
        await getMongoUser(
          result.user.email
        );

      // -----------------------------------------------
      // IMPORTANT
      // -----------------------------------------------
      //
      // Login.jsx will also validate the profile.
      // Here we simply restore the correct role.
      // -----------------------------------------------

      if (mongoUser) {
        const role = String(
          mongoUser.role || "user"
        )
          .trim()
          .toLowerCase();

        const finalUser = {
          ...mongoUser,

          uid: result.user.uid,
          email:
            result.user.email
              ?.trim()
              .toLowerCase(),

          displayName:
            result.user.displayName ||
            mongoUser.name ||
            "",

          role,
        };

        setCurrentUser(finalUser);

        localStorage.setItem(
          "khelaro-user",
          JSON.stringify(finalUser)
        );

        localStorage.setItem(
          "khelaro-uid",
          result.user.uid
        );
      } else {
        // Firebase account exists,
        // but MongoDB profile doesn't exist.

        const fallbackUser = {
          uid: result.user.uid,
          email:
            result.user.email
              ?.trim()
              .toLowerCase(),
          displayName:
            result.user.displayName || "",
          role: "user",
        };

        setCurrentUser(fallbackUser);

        localStorage.setItem(
          "khelaro-user",
          JSON.stringify(fallbackUser)
        );

        localStorage.setItem(
          "khelaro-uid",
          result.user.uid
        );
      }

      toast.success(
        "Login successful!"
      );

      return result.user;
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      if (
        error.code ===
          "auth/invalid-credential" ||
        error.code ===
          "auth/wrong-password" ||
        error.code ===
          "auth/user-not-found"
      ) {
        toast.error(
          "Invalid email or password."
        );
      } else if (
        error.code ===
        "auth/too-many-requests"
      ) {
        toast.error(
          "Too many attempts. Please try again later."
        );
      } else {
        toast.error(
          "Login failed. Please try again."
        );
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = async () => {
    try {
      await signOut(auth);

      setCurrentUser(null);

      localStorage.removeItem(
        "khelaro-user"
      );

      localStorage.removeItem(
        "khelaro-uid"
      );

      toast.success(
        "Logged out successfully."
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      toast.error(
        "Logout failed. Please try again."
      );

      throw error;
    }
  };

  // ===================================================
  // FIREBASE AUTH STATE LISTENER
  // ===================================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            setLoading(true);

            if (!firebaseUser) {
              setCurrentUser(null);

              localStorage.removeItem(
                "khelaro-user"
              );

              localStorage.removeItem(
                "khelaro-uid"
              );

              return;
            }

            // -----------------------------------------
            // IMPORTANT
            // -----------------------------------------
            //
            // Every time browser reloads,
            // Firebase restores the user.
            //
            // Then we ALSO fetch MongoDB profile
            // to restore the correct role.
            //
            // -----------------------------------------

            await buildCurrentUser(
              firebaseUser
            );
          } catch (error) {
            console.error(
              "Auth state restore error:",
              error
            );

            setCurrentUser(
              firebaseUser
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, []);

  // ===================================================
  // AUTH CONTEXT
  // ===================================================

  const authInfo = {
    currentUser,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider
      value={authInfo}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;