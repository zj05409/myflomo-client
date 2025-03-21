import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Notes: undefined;
    NoteInput: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Note {
    id: string;
    content: string;
    createdAt: string;
}

interface NoteListProps {
    onNotePress?: (note: Note) => void;
}

export default function NoteList({ onNotePress }: NoteListProps) {
    const navigation = useNavigation<NavigationProp>();
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        loadNotes();
        loadTags();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadNotes();
        });

        return unsubscribe;
    }, [navigation]);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    };

    const loadTags = async () => {
        try {
            const storedTags = await AsyncStorage.getItem('myflomo-tags');
            if (storedTags) {
                setTags(JSON.parse(storedTags));
            }
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? note.content.includes(`#${selectedTag}`) : true;
        return matchesSearch && matchesTag;
    });

    const renderNote = ({ item }: { item: Note }) => (
        <TouchableOpacity
            style={styles.noteItem}
            onPress={() => onNotePress?.(item)}
        >
            <Text style={styles.noteContent} numberOfLines={3}>
                {item.content}
            </Text>
            <Text style={styles.noteDate}>
                {new Date(item.createdAt).toLocaleString()}
            </Text>
        </TouchableOpacity>
    );

    const renderTag = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.tagItem,
                selectedTag === item && styles.selectedTag,
            ]}
            onPress={() => setSelectedTag(selectedTag === item ? null : item)}
        >
            <Text style={[
                styles.tagText,
                selectedTag === item && styles.selectedTagText,
            ]}>
                #{item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="搜索笔记..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                horizontal
                data={tags}
                renderItem={renderTag}
                keyExtractor={item => item}
                style={styles.tagsList}
            />

            <FlatList
                data={filteredNotes}
                renderItem={renderNote}
                keyExtractor={item => item.id}
                style={styles.notesList}
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('NoteInput')}
                color="#fff"
                backgroundColor="#3ab682"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    searchInput: {
        backgroundColor: '#f3f4f6',
        padding: 8,
        borderRadius: 8,
        fontSize: 16,
    },
    tagsList: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tagItem: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 4,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
    },
    selectedTag: {
        backgroundColor: '#3ab682',
    },
    tagText: {
        color: '#374151',
        fontSize: 14,
    },
    selectedTagText: {
        color: '#fff',
    },
    notesList: {
        flex: 1,
    },
    noteItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    noteContent: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
    },
    noteDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
}); 