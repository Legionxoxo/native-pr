import { icons } from "@/constants/icons";
import { requestImagePickerPermission, requestMediaLibraryPermission } from '@/utlis/permissions';
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);


    const [bio, setBio] = useState(
        "Film enthusiast since 2010. I love discussing cinematography and storytelling. Always looking for hidden gems and international films."
    );
    const [isEditingBio, setIsEditingBio] = useState(false);


    // Request permissions on component mount
    useEffect(() => {
        (async () => {
            await requestMediaLibraryPermission();
        })();
    }, []);

    const pickImage = async () => {
        try {
            const hasPermission = await requestImagePickerPermission();
            if (!hasPermission) return;

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.length > 0) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };


    return (
        <SafeAreaView className="bg-gray-900 flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="px-6 py-8">
                    {/* Header with Profile Image Picker */}
                    <View className="items-center mb-8">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="relative"
                        >
                            <View className="bg-indigo-700 rounded-full p-1 mb-1">
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        className="w-24 h-24 rounded-full"
                                    />
                                ) : (
                                    <Image
                                        source={icons.person}
                                        className="w-24 h-24"
                                        style={{ tintColor: "#fff" }}
                                    />
                                )}
                            </View>
                            <View className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1 border border-indigo-500">
                                <Image
                                    source={icons.person || { uri: "https://cdn-icons-png.flaticon.com/512/45/45010.png" }}
                                    className="w-6 h-6"
                                    style={{ tintColor: "#fff" }}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-white text-2xl font-bold mt-3">MovieBuff123</Text>
                        <Text className="text-gray-400">cinephile@movieapp.com</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-indigo-600 px-4 py-2 rounded-full mt-2"
                        >
                            <Text className="text-white">Change Profile Picture</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-between bg-gray-800 rounded-xl p-4 mb-6">
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">83</Text>
                            <Text className="text-gray-400">Reviews</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">156</Text>
                            <Text className="text-gray-400">Watchlist</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">412</Text>
                            <Text className="text-gray-400">Watched</Text>
                        </View>
                    </View>

                    {/* Favorite Genres */}
                    <View className="bg-gray-800 rounded-xl p-4 mb-6">
                        <Text className="text-white font-bold text-lg mb-2">Favorite Genres</Text>
                        <View className="flex-row flex-wrap">
                            {["Sci-Fi", "Thriller", "Drama", "Animation"].map((genre) => (
                                <View key={genre} className="bg-indigo-700 rounded-full px-3 py-1 m-1">
                                    <Text className="text-white">{genre}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Bio */}
                    <View className="bg-gray-800 rounded-xl p-4 mb-6">
                        <Text className="text-white font-bold text-lg mb-2">About</Text>

                        {isEditingBio ? (
                            <>
                                <TextInput
                                    value={bio}
                                    onChangeText={setBio}
                                    multiline
                                    numberOfLines={4}
                                    className="text-gray-200 bg-gray-700 rounded-lg p-3 mb-2"
                                    style={{ textAlignVertical: "top" }}
                                />
                                <TouchableOpacity
                                    onPress={() => setIsEditingBio(false)}
                                    className="bg-indigo-600 px-4 py-2 rounded-full"
                                >
                                    <Text className="text-white text-center">Save</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text className="text-gray-400 leading-5 mb-2">{bio}</Text>
                                <TouchableOpacity
                                    onPress={() => setIsEditingBio(true)}
                                    className="bg-indigo-600 px-4 py-2 rounded-full"
                                >
                                    <Text className="text-white text-center">Edit Bio</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>


                    {/* Preferences */}
                    <View className="bg-gray-800 rounded-xl p-4 mb-6">
                        <Text className="text-white font-bold text-lg mb-3">Preferences</Text>

                        {[
                            ["Favorite Director", "Christopher Nolan"],
                            ["Favorite Actor", "Tom Hanks"],
                            ["Favorite Movie", "Interstellar"],
                            ["Member Since", "March 2022"],
                        ].map(([label, value]) => (
                            <View key={label} className="flex-row mb-3">
                                <View className="w-1/2">
                                    <Text className="text-gray-400">{label}</Text>
                                </View>
                                <View className="w-1/2">
                                    <Text className="text-white">{value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Badges */}
                    <View className="bg-gray-800 rounded-xl p-4 mb-12">
                        <Text className="text-white font-bold text-lg mb-3">Badges</Text>

                        <View className="flex-row items-center mb-3">
                            <View className="bg-yellow-500 rounded-full p-2 mr-3">
                                <Image
                                    source={icons.star}
                                    className="w-5 h-5"
                                    style={{ tintColor: "#fff" }}
                                />
                            </View>
                            <Text className="text-white">Top Reviewer</Text>
                        </View>
                        {/* Add more badges here as needed */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default profile;