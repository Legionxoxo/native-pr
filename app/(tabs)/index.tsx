

import MovieCard from "@/components/MovieCard";
import SearchBar_temp from "@/components/SearchBar_temp";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import usefetch from "@/services/usefetch";
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const { data: movies, loading: moviesLoading, error: moviesError } = usefetch(() => fetchMovies({
    query: '',
  }))
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: 10,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading ? (
          <ActivityIndicator
            size='large'
            color='#000ff'
            className="mt-10 self-center"
          />
        ) : moviesError ? (<Text>Error:{moviesError?.message}</Text>) :
          (
            <View className="flex-1 mt-5">
              <SearchBar_temp
                onPress={() => router.push("/search")}
                placeholder="Search for a movie"
              />

              <>
                <Text className="text-lg font-bold mt-5 text-white mb-3">Latest Movies</Text>

                <FlatList data={movies}
                  renderItem={({ item }) => (
                    <Text className=" text-white text-sm" >
                      <MovieCard
                        {...item} />
                    </Text>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  scrollEnabled={false}
                  className="mt-2 pb-32"
                />
              </>
            </View>
          )
        }


      </ScrollView>
    </View>
  );
}
