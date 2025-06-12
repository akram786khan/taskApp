/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from "react-native";
import RNFS from "react-native-fs";
import Video from "react-native-video";
import { useDispatch } from "react-redux";
import { fetchVideos } from "../../redux/feature/videoSlice";

const VideoScreen = () => {
  const [downloaded, setDownloaded] = useState({});
  const [downloading, setDownloading] = useState({});
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    getAllData();
  }, [dispatch]);
  const getAllData = async () => {
    let res = await dispatch(fetchVideos());
    setVideoData(res.payload);
    setLoading(false);
    console.log("res of apis data-->>", res);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download Videos",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };
  const downloadVideo = async (item) => {
    const destinationPath = `${RNFS.DocumentDirectoryPath}/${item.id}.mp4`;
    setDownloading((prev) => ({ ...prev, [item.id]: true }));

    try {
      await RNFS.downloadFile({
        fromUrl: item.videoUrl,
        toFile: destinationPath,
      }).promise;

      setDownloaded((prev) => ({
        ...prev,
        [item.id]: "file://" + destinationPath,
      }));
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        {currentPlaying === item.id ? (
          <Video
            source={{ uri: downloaded[item.id] }}
            style={styles.video}
            controls
            resizeMode="contain"
          />
        ) : (
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        )}

        <View style={styles.infoBox}>
          <View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.title}>{item.duration}</Text>
            </View>
            <Text style={styles.title}>{item.author}</Text>
            <Text style={styles.title}>{item.uploadTime}</Text>
          </View>
          {downloading[item.id] ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : downloaded[item.id] ? (
            <TouchableOpacity
              onPress={() => setCurrentPlaying(item.id)}
              style={styles.playButton}
            >
              <Image
                source={require("../../assets/images/play.png")}
                style={{ height: 15, width: 15 }}
                tintColor={"red"}
              />
              <Text style={styles.btnText}>Play</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => downloadVideo(item)}
              style={styles.downloadButton}
            >
              <Image
                source={require("../../assets/images/download.png")}
                style={{ height: 15, width: 15 }}
                tintColor={"red"}
              />
              <Text style={styles.btnText}>Download</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return Loading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <FlatList
      data={videoData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#ded9d1",
    padding: 10,
    borderRadius: 10,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  infoBox: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  playButton: {
    backgroundColor: "#28a745",
    padding: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  btnText: {
    color: "#fff",
    marginLeft: 4,
  },
  video: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
});

export default VideoScreen;
