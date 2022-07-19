import { createContext, useContext, useEffect, useState} from "react";
import { collection, getDocs} from "firebase/firestore";
import {db } from '../Firebase/firebase-config'
import * as RootNavigation from './NavRef';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Popup } from "./Popup";
const userContext = createContext({});

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [items, setItems] = useState(null);
    const eventCollectionRef = collection(db, "events");
    // const logOut = async () => {
    //   let old_user = JSON.parse(await AsyncStorage.getItem('user'));
      
    //   let info = {  
    //     username: old_user.username,  
    //     email: old_user.email,  
    //     password: old_user.password,
    //     section: old_user.section,
    //     instrument: old_user.instrument,
    //     position: old_user.position,
    //     loggedin: false,
    //   }  
    //   await AsyncStorage.removeItem('user');
    //   await AsyncStorage.setItem('user',JSON.stringify(info));
    //   signOut(auth).then(()=>{
    //     RootNavigation.navigate('Login', {name: 'Login'})
    //   });
    // }
    const checkLoggedIn = async () => {
      // await AsyncStorage.removeItem('user');
      var parse = await AsyncStorage.getItem('user');
      // console.log(parse);
      var user = JSON.parse(parse);
      // console.log(user, "THS");
      setUser(user);
    }
    // const getData = async () => {
    //   try {
    //     console.log("GETTING DATA")
    //     const data = await getDocs(userCollectionRef);
    //     setUserData(data.docs.map((doc) =>({...doc.data(), id: doc.id})));
    //   } catch (error){
    //     console.log(error, "fAILED DATA");
    //     setUserData(null);
    //   }
    // }
    useEffect(()=>{
      if (user==null){
        checkLoggedIn();
      } else{
        changeLogIn().then(()=>{checkLoggedIn()});
      }
      
    }, [user])
    const changeLogIn = async () => {
      // await AsyncStorage.removeItem('user');
      const userInfo = JSON.stringify(user)
      // console.log(userInfo);
      await AsyncStorage.setItem('user', userInfo);
    }
    const getItems = async () =>{
      try {
        const data = await getDocs(eventCollectionRef);
        const listOfItems = data.docs.map((doc) =>({...doc.data(), id: doc.id}));
        const newItems = {};
        listOfItems.forEach(item => {
          if (item.guests == "Marching Band" || item.guests == user.section || item.guests == user.instrument || item.guests == user.position) {
            // console.log(user.section, user.instrument, user.position);
            // console.log(item.guests);
            if (!newItems[item.index]){
              newItems[item.index] = [];
            }
            newItems[item.index].push({
              name: item.name,
              location: item.location, 
              guests: item.guests,
              time: item.time, 
              date: item.date,
              info: item.info});
          }
          
      });
      
      setItems(newItems);
      } catch (error){
        setItems(null);
      }

}

useEffect(()=>{
  // getData()
  getItems();
  RootNavigation.navigate('Home', {name: 'Home'});
  // checkLoggedIn();

}, [])
  // const getUserData = async () => {
  //   console.log("GETTINGUSER")
  //   const userData = JSON.parse(await AsyncStorage.getItem('user'));
  //   console.log(userData);
  //   console.log(userData.email);
  //   console.log(user.email);
  //   if ((userData.email).toLowerCase() == (user.email).toLowerCase()){
  //     setUser(userData);
  //     console.log(userData, "USERDAˇA");
  //   }
  // };
  

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//     if (currentUser == null){
//       setUser([{
//         username: "",
//         password: "",
//         email: "",
//         section: "",
//         position: "",
//         instrument: "",
//       }])
//       RootNavigation.navigate('Login', {name: 'Login'})
//     } else{
//       setUser(currentUser);
//       RootNavigation.navigate('Home', {name: 'Home'})
//     }
//     getUserData();
//   });
//   return () => {
//     unsubscribe();
    
//   };
// }, []);
    return (
        <userContext.Provider value={{user, setUser, items, setItems, changeLogIn}}>
            {children}
        </userContext.Provider>
    )
}

export const userAuth = () => {
    return useContext(userContext);
}
