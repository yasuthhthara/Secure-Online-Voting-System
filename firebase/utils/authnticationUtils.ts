import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../config"
import IUser from "@/interfaces/IUser"

// register user
export const registerUser = (email: string, password: string, username: string, onSuccess?: (data: any) => void) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            onSuccess&& onSuccess(res)
            updateUser(username)
        })
        .catch((e) => {
            console.error(e.message)
        })
}

// login user
export const loginUser = (email: string, password: string, onSuccess?: (data: any) => void) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
        onSuccess&& onSuccess(res)
    })
    .catch((e) => {
        console.error(e.message)
    })
}

// get user
export const getCurrentUser = (onSuccess?: (data: any) => void) => {
    onAuthStateChanged(auth, (usr) => {
        if (usr) {
            onSuccess&& onSuccess(usr)
        }
    })
}

// update user information
export const updateUser = (username: string) => {
    if (auth.currentUser) {
        updateProfile(auth.currentUser, {displayName: username})
    }
}