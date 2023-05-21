import { ApplicationVerifier, MultiFactorResolver, PhoneAuthCredential, PhoneAuthProvider, PhoneMultiFactorGenerator, User, createUserWithEmailAndPassword, getMultiFactorResolver, multiFactor, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth } from "../config"
import IUser from "@/interfaces/IUser"

// register user
export const registerUser = (email: string, password: string, username: string, onSuccess?: (data: any) => void) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            onSuccess&& onSuccess(res)
            updateUser({displayName: username})
        })
        .catch((e) => {
            console.error(e.message)
        })
}

// login user
export const loginUser = (email: string, password: string, onSuccess?: (data: any) => void, onError?: (data: any) => void) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
        onSuccess&& onSuccess(res)
    })
    .catch((e) => {
        onError&& onError(e)
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
export const updateUser = async (userInfo: {}) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, userInfo)
    } else {
        console.error('current user not found')
    }
}

// sign out function
export const logoutUser = (onSuccess?: (data: any) => void) => {
    signOut(auth).then((res) => {
        onSuccess&& onSuccess(res)
    })
    .catch((e) => {
        console.error(e)
    })
}

// verify user is enrolled
export const verifyIfUserIsEnrolled = (user: User) => {
    const enrolledFactors = multiFactor(user).enrolledFactors;
    return enrolledFactors.length > 0
}

// verify phone number
export const verifyPhoneNumber = async (user: User, phoneNumber: string, recaptchaVerifier: ApplicationVerifier): Promise<false | string> => {
    const mfaSession = await multiFactor(user).getSession();
    const phoneInfoOptions = {
        phoneNumber,
        session: mfaSession
    }

    const phoneAuthProvider = new PhoneAuthProvider(auth);
    try {
        return await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
    } catch (e) {
        console.error(e)
        return false;
    }
}

// enroll user
export const enrollUser = async (user: User, varificationCodeId: string, verificationCode: string) => {
    const phoneAuthCredential = PhoneAuthProvider.credential(varificationCodeId, verificationCode);
    const mfaAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

    try {
        await multiFactor(user).enroll(mfaAssertion, 'Personal Phone Number');
        return true
    } catch (e) {
        return false
    }
}

// verify email
export const verifyEmail = async (user: User): Promise<boolean> => {
    try {
        await sendEmailVerification(user);
        return true
    } catch (e) {
        return false
    }
}

// resolve sign in
export const resolveSignIn = async (error: any, recaptchaVerifier: ApplicationVerifier) => {
    const resolver = getMultiFactorResolver(auth, error);
    // Ask user which second factor to use.
    if (resolver.hints[0].factorId ===
        PhoneMultiFactorGenerator.FACTOR_ID) {
        const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        // Send SMS verification code
        try {
            const verificationID = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
            return {verificationID, resolver}
        } catch(e) {
            return false
        }
    } else {
        // Unsupported second factor.
    }
}

// finalise login enrollment
export const finaliseLoginEnrollment = (verificationID: string, resolver: MultiFactorResolver, verificationCode: string) => {
    const cred = PhoneAuthProvider.credential(verificationID, verificationCode);
    const mfaAssertion = PhoneMultiFactorGenerator.assertion(cred);

    try {
        resolver.resolveSignIn(mfaAssertion);
        return true
    } catch (e) {
        return false
    }
}