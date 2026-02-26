import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) => {

        if(!uid) return set({ currentUser: null, isLoading: false });

        try {

            const docref = doc(db, "users", uid);
            const docSnap = await getDoc(docref);
            
            if (docSnap.exists) {
                set({ currentUser: docSnap.data(), isLoading: false });
            } else {
                console.error("No such user document!");
                set({ currentUser: null, isLoading: false });
            }

        } catch (error) {
            console.error("Error fetching user info:", error);
            return set({ currentUser: null, isLoading: false });
        }

    }
}));