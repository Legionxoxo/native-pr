import { requestAllPermissions, requestCameraPermission } from '@/utlis/permissions';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Saved() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            // First ensure we have permissions
            const permissionGranted = await requestAllPermissions();
            setHasPermission(permissionGranted);

            if (permissionGranted) {
                loadPhotos();
            }
        })();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);

            // Check permission status before accessing media library
            const { status } = await MediaLibrary.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    setHasPermission(false);
                    return;
                }
            }

            // Get all assets, sorted by creation time (newest first)
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.photo,
                first: 100,
                sortBy: [MediaLibrary.SortBy.creationTime],
            });

            console.log(`Found ${media.assets.length} photos`); // Debug log

            if (media.assets.length > 0) {
                // Ensure we have valid URI for each asset
                const validAssets = media.assets.filter(asset => asset.uri);
                setPhotos(validAssets);
            } else {
                setPhotos([]);
            }
        } catch (error) {
            console.error('Error loading photos:', error);
            Alert.alert('Error', 'Failed to load photos: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPhotos();
    };

    const takePhoto = async () => {
        const cameraPermission = await requestCameraPermission();

        if (!cameraPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                // Save to media library
                await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
                // Reload photos to include the newly taken photo
                loadPhotos();
                Alert.alert('Success', 'Photo saved to gallery');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo: ' + error.message);
        }
    };

    const renderItem = ({ item }: any) => {
        // Ensure we have a valid URI
        if (!item || !item.uri) {
            return null;
        }

        return (
            <TouchableOpacity
                style={styles.photoContainer}
                onPress={() => {
                    // Optional: Preview the image in full screen
                    console.log('Tapped photo:', item.uri);
                }}
            >
                <Image
                    source={{ uri: item.uri }}
                    style={styles.photo}
                    // Add placeholder for when image is loading
                    // Add error handling
                    onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                />
            </TouchableOpacity>
        );
    };

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>We need permission to access your photos and camera.</Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={async () => {
                        const granted = await requestAllPermissions();
                        setHasPermission(granted);
                        if (granted) loadPhotos();
                    }}
                >
                    <Text style={styles.permissionButtonText}>Grant Permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>My Gallery</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Loading photos...</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={photos}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={3}
                        contentContainerStyle={styles.photosList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No photos found</Text>
                                <Text style={styles.emptySubText}>Photos you take will appear here</Text>
                                <TouchableOpacity
                                    style={styles.emptyButton}
                                    onPress={takePhoto}
                                >
                                    <Text style={styles.emptyButtonText}>Take a Photo</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />

                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={takePhoto}
                    >
                        <Ionicons name="camera" size={24} color="white" />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    photosList: {
        padding: 4,
        flexGrow: 1, // Ensure it takes full space even with few items
    },
    photoContainer: {
        flex: 1 / 3,
        margin: 4,
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#e1e1e1', // Background for when image is loading
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensure proper image scaling
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#757575',
        fontWeight: 'bold',
    },
    emptySubText: {
        fontSize: 14,
        color: '#9E9E9E',
        marginTop: 8,
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    permissionButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#2196F3',
        borderRadius: 8,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});