// ChatScreen.js
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  Alert,
} from 'react-native';
import { heightPercentageToDP } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Tts from 'react-native-tts';
import Sound from 'react-native-nitro-sound';
import { useQuery } from '@realm/react';
import { Expense } from '../../db/schema/Expense';
import { useAuth } from '../../context/authContext';
import { COLORS, STRINGS } from '../Constants';
import { aiApi } from '../../services/apiClient';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();
  const expense = useQuery(Expense)
    .filtered('userId == $0', user?.id ?? '')
    .sorted('date', true);
  const [speaking, setSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    EncryptedStorage.getItem('chatHistory').then(data => {
      if (data) {
        setMessages(JSON.parse(data) as ChatMessage[]);
      }
    });
  }, []);

  const resetHistory = async () => {
    await EncryptedStorage.removeItem('chatHistory').finally(() => {
      navigation.goBack()
    });
  };

  useEffect(() => {
    Tts.setDefaultLanguage('en-IN');
    Tts.setDefaultPitch(1.2);

    // Listen for finish event
    const finishListener = Tts.addEventListener('tts-finish', () => {
      setSpeaking(false);
    }) as { remove?: () => void } | void;

    return () => {
      if (finishListener && 'remove' in finishListener) {
        finishListener.remove?.();
      }
    };
  }, []);

  const speakReply = () => {
    let contentMessage = messages
      .map(item => `${item.role}: ${item.content}. `)
      .join('\n\n');

    console.log(contentMessage);
    setSpeaking(true);
    Tts.speak(contentMessage);
  };

  const stopSpeaking = () => {
    Tts.stop(true);
    setSpeaking(false);
  };

  const sendMessage = async (message = input) => {
    if (!message.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: message };
    const newHistory = [...messages, userMsg];

    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const data = await aiApi.chat({
        message,
        history: messages,
        transaction: expense,
      });
      setMessages([
        ...newHistory,
        { role: 'assistant', content: String(data.reply) },
      ]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: STRINGS.chat.fallbackError,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: STRINGS.chat.micPermissionTitle,
          message: STRINGS.chat.micPermissionMessage,
          buttonPositive: 'Allow',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handled via Info.plist
  };

  const startRecording = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      Alert.alert(STRINGS.chat.deniedMic);
      return;
    }

    try {
      // startRecorder returns the URI where audio is being saved
      const uri = await Sound.startRecorder();
      console.log('Recording started at:', uri);
      setIsRecording(true);
      setInput(STRINGS.chat.recording);
    } catch (err) {
      console.error('Start recording error:', err);
    }
  };

  const transcribeAudio = async (uri: string) => {
    setInput(STRINGS.chat.transcribing);

    const formData = new FormData();
    formData.append('audio', {
      uri: Platform.OS === 'android' ? `file://${uri}` : uri,
      type: Platform.OS === 'android' ? 'audio/mp4' : 'audio/m4a',
      name: 'voice_recording',
    });

    try {
      const data = await aiApi.transcribe(formData);
      await sendMessage(String(data.text ?? ''));
    } catch (err) {
      setInput('');
      Alert.alert(STRINGS.common.error, STRINGS.alerts.transcriptionFailed);
    }
  };

  const stopRecording = async () => {
    setInput('');
    try {
      const uri = await Sound.stopRecorder();
      console.log('Recording saved at:', uri);
      setIsRecording(false);
      await transcribeAudio(uri); // send to your Whisper endpoint
    } catch (err) {
      console.error('Stop recording error:', err);
    }
  };

  useEffect(() => {
    EncryptedStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.bubble,
        item.role === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          item.role === 'user' ? styles.userText : styles.aiText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome6
              name={'chevron-left'}
              iconStyle="solid"
              color={'black'}
              size={heightPercentageToDP(2)}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{STRINGS.chat.title}</Text>
          <View style={styles.headerDot} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                speaking && { backgroundColor: COLORS.purple },
              ]}
              onPress={() => (speaking ? stopSpeaking() : speakReply())}
            >
              {' '}
              <Text style={styles.iconBtnText}>
                {' '}
                {speaking ? '🔇' : '🔊'}{' '}
              </Text>{' '}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => resetHistory()}>
              <Text style={{ color: COLORS.textMuted }}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message list */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => `${i}`}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🤖</Text>
              <Text style={styles.emptyTitle}>{STRINGS.chat.emptyTitle}</Text>
              <Text style={styles.emptySub}>{STRINGS.chat.emptySubtitle}</Text>
            </View>
          }
          renderItem={renderItem}
        />

        {/* Typing indicator */}
        {loading && (
          <View style={styles.typingRow}>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>{STRINGS.chat.thinking}</Text>
            </View>
          </View>
        )}

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            editable={!isRecording}
            placeholder={STRINGS.chat.emptyTitle}
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={() => void sendMessage()}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={{ alignSelf: 'center', padding: heightPercentageToDP(1) }}
          >
            <FontAwesome6
              name="microphone"
              iconStyle="solid"
              color={isRecording ? COLORS.info : COLORS.textPrimary}
              size={heightPercentageToDP(2)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!input?.trim() || loading) && styles.sendBtnDisabled,
            ]}
            onPress={() => void sendMessage()}
            disabled={!input?.trim() || loading || isRecording}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  container: {
    flex: 1,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.info,
  },

  // Messages
  messageList: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#1D9E75',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.surface,
  },
  aiText: {
    color: COLORS.textPrimary,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Typing indicator
  typingRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  typingBubble: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  typingText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e5e5',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a1a',
    maxHeight: 120,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1D9E75',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#c8e6dc',
  },
  sendBtnText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
});
