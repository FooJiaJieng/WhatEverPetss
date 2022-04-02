import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import Colors from './src/constant/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonStore } from './store/CommonStore';


//Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


//Screen
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import BuyerProfileScreen from './src/screen/BuyerProfileScreen';
import SellerProfileScreen from './src/screen/SellerProfileScreen';
import SellerStoreScreen from './src/screen/SellerStore';
import AddProductScreen from './src/screen/AddProductScreen';



//Firebase
import { collection, getDocs, query, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { authentication, db } from './constants/key';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOption = {
  headerTitleAlign: 'center',
  //headerTintColor: Colors.black,
  headerStyle: {
    //backgroundColor: 'blue',
  },
};

function LoginScreenStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
};

function HomeScreenStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} options={ headerOption }/>
    </Stack.Navigator>
  )
};

function BuyerProfileScreenStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name='BuyerProfile' component={BuyerProfileScreen} options={ headerOption }/>
    </Stack.Navigator>
  )
};

function SellerScreenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='SellerProfile' component={SellerProfileScreen} options={ headerOption } />
      <Stack.Screen name='AddProduct' component={AddProductScreen} options={ headerOption } />
      <Stack.Screen name='SellerStore' component={SellerStoreScreen} options={ headerOption } />
    </Stack.Navigator>
  );
}

export default function App() {

  const isLoggedIn = CommonStore.useState(s => s.isLoggedIn);
  const userSelected = CommonStore.useState(s => s.userSelected);
  const serviceList = CommonStore.useState(s => s.serviceList);
  const userType = CommonStore.useState(s => s.userType);

  const [userListTemp, setUserListTemp] = useState([]);

  useEffect(() => {
     onSnapshot(collection(db, 'Service'), (snapshot) => {
      setUserListTemp(snapshot.docs.map((doc) => doc.data()))
    });
    CommonStore.update( s => {
      s.serviceList = userListTemp
    });
  },[isLoggedIn]);

  //console.log(serviceList);

  return (
    <NavigationContainer>
      { isLoggedIn && userType == 'CUSTOMER' ?
        <Tab.Navigator
          screenOptions={({ route }) => ({
            "tabBarActiveBackgroundColor": Colors.mediumPurple,
              "tabBarInactiveBackgroundColor": Colors.lavender,
              "tabBarShowLabel": false,
              "tabBarStyle": [
                {
                  "display": "flex"
                },
                null
              ],
            tabBarStyle: {
              height: 80,
              borderTopWidth: 1,
            },
            tabBarIcon: ({ focused, color, size }) => {
              
              if (route.name === 'Home') {
                return (
                  <Ionicons name={'md-home-outline'} size={25} />
                );
              } else if (route.name === 'BuyerProfile') {
                return (
                  <Ionicons name={'menu'} size={25} />
                );
              }

              // You can return any component that you like here!
              return <Ionicons name={'md-home-outline'} size={32} />;
            
            },
        })}>
            <Tab.Screen name="Home" component={HomeScreenStack} options={{ headerShown: false }}/>
            <Tab.Screen name="BuyerProfile" component={BuyerProfileScreenStack} options={{ headerShown: false }}/>
        </Tab.Navigator>
      :
      isLoggedIn && userType == 'SELLER' ?
      <Tab.Navigator
        screenOptions={({ route }) => ({
            "tabBarActiveBackgroundColor": Colors.mediumPurple,
            "tabBarInactiveBackgroundColor": Colors.lavender,
            "tabBarShowLabel": false,
            "tabBarStyle": [
              {
                "display": "flex"
              },
              null
            ],
          tabBarStyle: {
            height: 80,
            borderTopWidth: 1,
            //display: route.name === ('Profile' && 'AddProduct') ? 'none' : null,
          },
          //tabBarVisible: false,
          tabBarIcon: ({ focused, color, size }) => {

            if (route.name === 'Seller') {
              return (
                <Ionicons name={'menu'} size={25} />
              );
            } else if (route.name === 'Chat') {
              return (
                <Ionicons name={'chatbox-ellipses-outline'} size={25} />
              );
            }

            // You can return any component that you like here!
            return <Ionicons name={'md-home-outline'} size={32} />;
          
          },
        })}>
          <Tab.Screen name="SellerProfile" component={SellerScreenStack} options={{ headerShown: false }}/>
          {/* <Tab.Screen name="Chat" component={ChatScreenStack} options={{ headerShown:  false }}/> */}
        </Tab.Navigator>
      :
      <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginScreenStack} options={{ headerShown: false }}/>
      </Stack.Navigator>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
