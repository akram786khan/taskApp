// App.js
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import BottomTabs from './src/ navigation/BottomTabs';
import {NavigationContainer} from '@react-navigation/native';
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// import React from 'react';
// import {Button, View, Text} from 'react-native';
// import RNFS from 'react-native-fs';

// const App = () => {
//   const downloadVideo = async () => {
//     const videoUrl =
//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
//     const destinationPath = RNFS.DocumentDirectoryPath + '/video.mp4';

//     try {
//       const downloadResult = await RNFS.downloadFile({
//         fromUrl: videoUrl,
//         toFile: destinationPath,
//       }).promise;
//       alert('Download complete!');
//       console.log('Download complete:', downloadResult);
//     } catch (error) {
//       alert('Download failed!');
//       console.error('Download failed:', error);
//     }
//   };

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Button title="Download Video" onPress={downloadVideo} />
//     </View>
//   );
// };

// export default App;

// import React, {useState} from 'react';
// import {Button, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import RNFS from 'react-native-fs';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/Ionicons';

// const App = () => {
//   const [videoPath, setVideoPath] = useState(null);
//   const [showPlayer, setShowPlayer] = useState(false);

//   const downloadVideo = async () => {
//     const videoUrl =
//       'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
//     const destinationPath = `${RNFS.DocumentDirectoryPath}/video.mp4`;

//     try {
//       const result = await RNFS.downloadFile({
//         fromUrl: videoUrl,
//         toFile: destinationPath,
//       }).promise;

//       if (result.statusCode === 200) {
//         setVideoPath('file://' + destinationPath);
//         alert('Download complete!');
//       } else {
//         alert('Download failed!');
//       }
//     } catch (error) {
//       console.error('Download failed:', error);
//       alert('Download failed!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {!videoPath ? (
//         <Button title="Download Video" onPress={downloadVideo} />
//       ) : !showPlayer ? (
//         <TouchableOpacity
//           onPress={() => setShowPlayer(true)}
//           style={styles.playIcon}>
//           <Icon name="play-circle" size={70} color="#007bff" />
//           <Text style={{marginTop: 10}}>Play Downloaded Video</Text>
//         </TouchableOpacity>
//       ) : (
//         <Video
//           source={{uri: videoPath}}
//           style={styles.video}
//           controls
//           resizeMode="contain"
//         />
//       )}
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playIcon: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   video: {
//     width: '100%',
//     height: 300,
//   },
// });

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import RNFS from 'react-native-fs';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/Ionicons';

// const videoData = [
//   {
//     id: '1',
//     title: 'Big Buck Bunny',
//     thumbnail:
//       'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
//     uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//   },
//   {
//     id: '2',
//     title: 'Elephant Dream',
//     thumbnail:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Elephants_Dream_s1_proog.jpg/800px-Elephants_Dream_s1_proog.jpg',
//     uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//   },
// ];

// const VideoListDownloader = () => {
//   const [downloaded, setDownloaded] = useState({});
//   const [downloading, setDownloading] = useState({});
//   const [currentPlaying, setCurrentPlaying] = useState(null);

//   const downloadVideo = async item => {
//     const destinationPath = `${RNFS.DocumentDirectoryPath}/${item.id}.mp4`;
//     setDownloading(prev => ({...prev, [item.id]: true}));

//     try {
//       await RNFS.downloadFile({
//         fromUrl: item.uri,
//         toFile: destinationPath,
//       }).promise;

//       setDownloaded(prev => ({
//         ...prev,
//         [item.id]: 'file://' + destinationPath,
//       }));
//     } catch (error) {
//       console.error('Download failed:', error);
//     } finally {
//       setDownloading(prev => ({...prev, [item.id]: false}));
//     }
//   };

//   const renderItem = ({item}) => {
//     return (
//       <View style={styles.card}>
//         <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
//         <View style={styles.infoBox}>
//           <Text style={styles.title}>{item.title}</Text>

//           {downloading[item.id] ? (
//             <ActivityIndicator size="small" color="#007bff" />
//           ) : downloaded[item.id] ? (
//             <TouchableOpacity
//               onPress={() => setCurrentPlaying(item.id)}
//               style={styles.playButton}>
//               <Icon name="play" size={20} color="#fff" />
//               <Text style={styles.btnText}>Play</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               onPress={() => downloadVideo(item)}
//               style={styles.downloadButton}>
//               <Icon name="download" size={20} color="#fff" />
//               <Text style={styles.btnText}>Download</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {currentPlaying === item.id && (
//           <Video
//             source={{uri: downloaded[item.id]}}
//             style={styles.video}
//             controls
//             resizeMode="contain"
//           />
//         )}
//       </View>
//     );
//   };

//   return (
//     <FlatList
//       data={videoData}
//       renderItem={renderItem}
//       keyExtractor={item => item.id}
//       contentContainerStyle={styles.listContainer}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   listContainer: {
//     padding: 10,
//   },
//   card: {
//     marginBottom: 20,
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     borderRadius: 10,
//   },
//   thumbnail: {
//     width: '100%',
//     height: 180,
//     borderRadius: 10,
//   },
//   infoBox: {
//     flexDirection: 'row',
//     marginTop: 10,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: {
//     flex: 1,
//     fontWeight: 'bold',
//   },
//   downloadButton: {
//     backgroundColor: '#007bff',
//     padding: 6,
//     borderRadius: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   playButton: {
//     backgroundColor: '#28a745',
//     padding: 6,
//     borderRadius: 6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   btnText: {
//     color: '#fff',
//     marginLeft: 4,
//   },
//   video: {
//     width: '100%',
//     height: 200,
//     marginTop: 10,
//   },
// });

// export default VideoListDownloader;
