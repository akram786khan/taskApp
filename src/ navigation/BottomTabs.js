/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import TaskScreen from '../screens/Task/TaskScreen';
import VideoScreen from '../screens/ Video/VideoScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconSource;

          if (route.name === 'Videos') {
            iconSource = focused
              ? require('../assets/images/videoImage.png')
              : require('../assets/images/videoImage.png');
          } else if (route.name === 'Tasks') {
            iconSource = focused
              ? require('../assets/images/task.png')
              : require('../assets/images/task.png');
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#007bff' : 'gray',
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Videos" component={VideoScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
