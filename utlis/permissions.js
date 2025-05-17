import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        Alert.alert(
            "Permission Required",
            "Please allow access to your photo library to upload profile pictures."
        );
        return false;
    }
    return true;
};

export const requestImagePickerPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        Alert.alert(
            "Permission Denied",
            "We need access to your photos to set a profile picture."
        );
        return false;
    }
    return true;
};
