import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useNoteStore } from '../store/noteStore';
import { Note } from '../types/note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    NoteList: undefined;
    NoteInput: { note?: Note };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NoteList() {
    const navigation = useNavigation<NavigationProp>();
    const { notes } = useNoteStore();

    const renderItem = ({ item }: { item: Note }) => (
        <TouchableOpacity
            style={styles.noteItem}
            onPress={() => navigation.navigate('NoteInput', { note: item })}
        >
            <Text style={styles.noteContent}>{item.content}</Text>
            {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.noteImage} />
            )}
            <View style={styles.tagsContainer}>
                {item.tags.map((tag) => (
                    <Text key={tag} style={styles.tag}>
                        #{tag}
                    </Text>
                ))}
            </View>
            <Text style={styles.timestamp}>
                {new Date(item.createdAt).toLocaleString()}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('NoteInput')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        padding: 16,
    },
    noteItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    noteContent: {
        fontSize: 16,
        marginBottom: 8,
    },
    noteImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    tag: {
        color: '#1976d2',
        marginRight: 8,
    },
    timestamp: {
        color: '#666',
        fontSize: 12,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
}); 