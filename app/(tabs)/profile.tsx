import { icons } from "@/constants/icons";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
    return (
        <SafeAreaView className="bg-gray-900 flex-1">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="px-6 py-8">
                    {/* Header */}
                    <View className="items-center mb-8">
                        <View className="bg-indigo-700 rounded-full p-1 mb-4">
                            <Image
                                source={icons.person}
                                className="w-24 h-24"
                                style={{ tintColor: "#fff" }}
                            />
                        </View>
                        <Text className="text-white text-2xl font-bold">MovieBuff123</Text>
                        <Text className="text-gray-400">cinephile@movieapp.com</Text>
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
                        <Text className="text-gray-400 leading-5">
                            Film enthusiast since 2010. I love discussing cinematography and storytelling. Always looking for hidden gems and international films.
                        </Text>
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
