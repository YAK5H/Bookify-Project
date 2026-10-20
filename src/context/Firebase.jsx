import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup , GoogleAuthProvider , onAuthStateChanged} from "firebase/auth";
import { getFirestore, collection, addDoc , getDocs, getDoc, doc, query, where} from "firebase/firestore";
// import { getStorage , ref, uploadBytes, getDownloadURL} from "firebase/storage";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyCa23FYCJj0nvt41VhKNTT6Y8DmKpug2Wg",
  authDomain: "bookify-b421d.firebaseapp.com",
  projectId: "bookify-b421d",
  storageBucket: "bookify-b421d.firebasestorage.app",
  messagingSenderId: "1068917457297",
  appId: "1:1068917457297:web:02ba50fff636421ccb1a30"
};

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(firebaseApp);

const firestore = getFirestore(firebaseApp);

// const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props)=>{

    const [user,setUser] = useState(null);

    useEffect(()=>{
        onAuthStateChanged(firebaseAuth,(user)=>{
            if(user) setUser(user);
            else setUser(null);
        })
    },[])

    const signupUserWithEmailAndPassword = (email,password)=>{
        createUserWithEmailAndPassword(firebaseAuth,email,password);
    }

    const signinUserWithEmailAndPassword = (email,password)=>{
        signInWithEmailAndPassword(firebaseAuth,email,password);
    }

    const signinWithGoogle = () => signInWithPopup(firebaseAuth,googleProvider);

    const listAllBooks = ()=>{
        return getDocs(collection(firestore,"books"));
    }

    const getBookById = async (id)=>{
        const docRef = doc(firestore,'books',id);
        const result = await getDoc(docRef);
        return result;
    }

    const isLoggedIn = user ? true : false;

    // const getImageURL = (path)=>{
    //     return getDownloadURL(ref(storage,path));
    // }

    const placeOrder = async (bookId,qty)=>{
        const collectionRef = collection(firestore,"books",bookId,"orders")
        const result = await addDoc(collectionRef,{
            userID: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            qty: Number(qty),
        })
        return result;
    }

    const fetchMyBooks = async (userId)=>{
        const collectionRef = collection(firestore,"books");
        const q = query(collectionRef,where(userId, '==', userId));
        const result = await getDocs(q);
        return result;
    }

    const getOrders = async(bookId)=>{
        const collectionRef = collection(firestore,'books',bookId,'orders')
        const result = await getDocs(collectionRef);
        return result;
    }

    const convertImageToBas64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handleCreateNewListing = async (name,isbn,price,cover)=>{

        let imageURL = "";
        
        // If an image file was selected, convert it to a string
        if (cover) {
            imageURL = await convertImageToBas64(cover);
        }

        // const imageRef = ref(storage,`uploads/images/$${Date.now()}-${cover.name}`);
        // const uploadResult = await uploadBytes(imageRef,cover);
        return await addDoc(collection(firestore,'books'),{
            name,
            isbn,
            price,
            // imageURL: uploadResult.ref.fullPath,
            imageURL: imageURL, // Saves the base64 string directly in Firestore
            userID: user.uid,
            userEmail: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        })
    };

    return (
        <FirebaseContext.Provider value={{signupUserWithEmailAndPassword,signinUserWithEmailAndPassword,signinWithGoogle,isLoggedIn,handleCreateNewListing,listAllBooks,getBookById,placeOrder,fetchMyBooks,user,getOrders}}>
            {props.children}
        </FirebaseContext.Provider>
    )
};