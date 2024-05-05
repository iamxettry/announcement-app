import { create } from "zustand";

export const useStore = create((set)=>({
    userAuthenticated: false,
    setUserLoggedIn: (value)=>set({userAuthenticated: value}),
}))