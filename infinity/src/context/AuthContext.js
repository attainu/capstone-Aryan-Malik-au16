import React, { useContext, useState, useEffect } from 'react'

import { auth,db,FieldValue } from '../config/firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    const signUp = (url, username, email, password, followers, following) => {
        if (url !== "") {
            return auth
                .createUserWithEmailAndPassword(email, password)
                .then((authUser) => {
                    authUser.user.updateProfile({
                        displayName: username,
                        photoURL: url
                    })
                        .then(() => {
                            db
                                .collection("users")
                                .doc(auth.currentUser.uid)
                                .set({
                                    userId: auth.currentUser.uid,
                                    username,
                                    url,
                                    email,
                                    followers,
                                    following
                                })
                        })
                })
        }
        else {
            alert("Select Avatar to signup")
        }
    }

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const logout = () => {
        return auth.signOut()
    }

    const getSuggestedProfiles = async (userId, following) => {
        const result = await db.collection('users').limit(10).get();
        return result.docs
            .map((user) => ({ ...user.data(), docId: user.id }))
            .filter((profile) => profile.userId !== userId && !following.includes(profile.userId))
    }

    const getfollowedProfiles = async (userId, following) => {
        const result = await db.collection('users').get();
        return result.docs
            .map((user) => ({ ...user.data(), docId: user.id }))
            .filter((profile) => profile.userId !== userId && following.includes(profile.userId))
    }
    
    const updateLoggedInUserFollowing = async (loggedInUserdocId, profileId, isFollowingProfile) => {
        return db
            .collection('users')
            .doc(loggedInUserdocId)
            .update({
                followers: isFollowingProfile
                    ? FieldValue.arrayRemove(profileId)
                    : FieldValue.arrayUnion(profileId)
            })
    };

    const updateFollowedUserFollowing = async (profiledocId,loggedInUserdocId,isFollowingProfile) => {
        return db
            .collection('users')
            .doc(profiledocId)
            .update({
                following: isFollowingProfile
                    ? FieldValue.arrayRemove(loggedInUserdocId)
                    : FieldValue.arrayUnion(loggedInUserdocId)
            })
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    auth.onAuthStateChanged(user => {
        setCurrentUser(user)
    })

    const value = {
        currentUser,
        signUp,
        login,
        logout,
        getSuggestedProfiles,
        getfollowedProfiles,
        updateFollowedUserFollowing,
        updateLoggedInUserFollowing
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
