import React from 'react';

import GalleryScreen from './screens/GalleryScreen';
import HomeScreen from './screens/HomeScreen';
import SnapScreen from './screens/SnapScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { Provider } from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import pictureList from "./reducers/pictures";
import pseudo from "./reducers/pseudo";

import { Ionicons } from '@expo/vector-icons';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = createStore(combineReducers({pictureList,pseudo}));

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name == 'Gallery') {
            iconName = 'image-sharp';
          } else if (route.name == 'Snap') {
            iconName = 'ios-camera';
          }
  
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        })}
      tabBarOptions={{
        activeTintColor: '#009788',
        inactiveTintColor: '#FFFFFF',
        style: {
          backgroundColor: '#111224',
        }
      }}
    >
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Snap" component={SnapScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BottomNavigator" component={BottomNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

