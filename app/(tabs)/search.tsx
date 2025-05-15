import MovieCard from '@/components/MovieCard'
import SearchBar_temp from '@/components/SearchBar_temp'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import usefetch from '@/services/usefetch'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const search = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const { data: movies,
        loading: moviesLoading,
        error: moviesError,
        refetch: loadMovies,
        reset
    } = usefetch(() => fetchMovies({
        query: searchQuery
    }), false)

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset()
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [searchQuery])

    useEffect(() => {
        if (Array.isArray(movies) && movies?.length > 0 && movies?.[0]) {
            updateSearchCount(searchQuery, movies[0])
        }
    }, [movies])

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className='px-5'
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'center',
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: 100
                }}
                ListHeaderComponent={
                    <>
                        <View className='w-full flex-row justify-center items-center mt-20'>
                            <Image source={icons.logo} className='w-12 h-10' />

                        </View>
                        <View className='my-5'>
                            <SearchBar_temp
                                placeholder='Search movies...'
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>

                        {moviesLoading && (
                            <ActivityIndicator size='large' color='#000ff' className='my-3' />
                        )}

                        {moviesError && (
                            <Text className='text-red-500 px-5 my-3'>
                                Error: {moviesError.message}
                            </Text>
                        )}

                        {!moviesLoading && !moviesError && searchQuery.trim() && Array.isArray(movies) && movies.length > 0 && (
                            <Text className='text-xl text-white font-bold'>
                                Search Results for {' '}
                                <Text className='text-accent'>{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !moviesLoading && !moviesError ? (
                        <View className='items-center my-4'>
                            <Text className='text-center text-gray-500'>
                                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
                            </Text>
                        </View>
                    ) : null
                } />
        </View>
    )
}

export default search

