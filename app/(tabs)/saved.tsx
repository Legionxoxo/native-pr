import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";

// Dummy saved movies data grouped by time period
const dummySavedMovies = {
    today: [
        {
            id: 102,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            vote_average: 8.7,
            release_date: "1999-03-31",
        },
    ],
    lastWeek: [
        {
            id: 201,
            title: "Pulp Fiction",
            poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            vote_average: 8.9,
            release_date: "1994-10-14",
        },
        {
            id: 202,
            title: "The Shawshank Redemption",
            poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            vote_average: 9.3,
            release_date: "1994-09-23",
        },
        {
            id: 203,
            title: "The Dark Knight",
            poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            vote_average: 9.0,
            release_date: "2008-07-18",
        },
    ],
    lastMonth: [
        {
            id: 301,
            title: "Interstellar",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            vote_average: 8.6,
            release_date: "2014-11-07",
        },
        {
            id: 302,
            title: "The Godfather",
            poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            vote_average: 9.2,
            release_date: "1972-03-24",
        },
        {
            id: 303,
            title: "Fight Club",
            poster_path: "/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
            vote_average: 8.8,
            release_date: "1999-10-15",
        },
    ],
};

type Movie = {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
};

type SavedMovies = {
    today: Movie[];
    lastWeek: Movie[];
    lastMonth: Movie[];
};
export default function saved() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [savedMovies, setSavedMovies] = useState<SavedMovies>({
        today: [],
        lastWeek: [],
        lastMonth: [],
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                setSavedMovies(dummySavedMovies);
                setError(null);
            } catch (err) {
                setError(new Error("Failed to load saved movies"));
            } finally {
                setLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const renderSavedSection = (title: string, movies: any[]) => {
        if (movies.length === 0) return null;

        return (
            <View className="mb-8">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg text-white font-bold">{title}</Text>
                    {movies.length > 3 && (
                        <TouchableOpacity>
                            <Text className="text-indigo-400 text-sm">See all</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={movies}
                    renderItem={({ item }) => <MovieCard {...item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "flex-start",
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 10,
                    }}
                    scrollEnabled={false}
                />
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <View className="flex-row justify-between items-center mx-5 mb-5">
                <Text className="text-white text-2xl font-bold">Saved Movies</Text>
                <TouchableOpacity className="bg-indigo-700 rounded-full p-2">
                    <Image source={icons.save} className="size-5" tintColor="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#818cf8" className="mt-10" />
            ) : error ? (
                <View className="flex-1 justify-center items-center px-5">
                    <Text className="text-red-500 text-center">{error.message}</Text>
                    <TouchableOpacity
                        className="mt-4 bg-indigo-700 py-2 px-4 rounded-lg"
                        onPress={() => setLoading(true)}
                    >
                        <Text className="text-white">Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 80,
                    }}
                >
                    {/* Today's Saved Movies */}
                    {renderSavedSection("Today", savedMovies.today)}

                    {/* Last Week's Saved Movies */}
                    {renderSavedSection("Last Week", savedMovies.lastWeek)}

                    {/* Last Month's Saved Movies */}
                    {renderSavedSection("Last Month", savedMovies.lastMonth)}

                    {/* Empty State */}
                    {Object.values(savedMovies).every(arr => arr.length === 0) && (
                        <View className="flex-1 justify-center items-center mt-20">
                            <Image
                                source={icons.save}
                                className="size-16 mb-4 opacity-30"
                                tintColor="#818cf8"
                            />
                            <Text className="text-white text-lg font-semibold mb-2">No saved movies</Text>
                            <Text className="text-gray-400 text-center">
                                Movies you save will appear here organized by when you saved them
                            </Text>
                            <TouchableOpacity
                                className="mt-6 bg-indigo-700 py-3 px-6 rounded-lg"
                                onPress={() => router.push("/")}
                            >
                                <Text className="text-white font-semibold">Explore Movies</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}