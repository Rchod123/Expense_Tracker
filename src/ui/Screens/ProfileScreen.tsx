import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../Components/ScreenHeader';
import { ImageAssets } from '../../assets';
import { TextComponent } from '../Components/TextComponent';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { RootStackParamList } from '../../types/navigation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/authContext';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';

const data = [
  {
    name: STRINGS.profile.accountInfo,
    icon: 'user',
    nav: 'Account',
  },
  {
    name: STRINGS.profile.personalProfile,
    icon: 'users',
    nav: 'Profile',
  },
  {
    name: STRINGS.profile.messageCenter,
    icon: 'inbox',
    nav: 'Message',
  },
  {
    name: STRINGS.profile.loginAndSecurity,
    icon: 'shield-halved',
    nav: 'Security',
  },
  {
    name: STRINGS.profile.dataAndPrivacy,
    icon: 'file-shield',
    nav: 'Privacy',
  },
] as const;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const onNavPress = (value: (typeof data)[number]['nav']) => {
    switch (value) {
      case 'Security': {
       return navigation.navigate('Security');
      }
      case 'Account': {
        return navigation.navigate('Account');
      }
      case 'Profile': {
        return navigation.navigate('PersonalProfile');
      }
      case 'Message': {
        return navigation.navigate('Message');
      }
      case 'Privacy': {
        return navigation.navigate('Privacy');
      }
      default: {
        return null;
      }
    }
  };
  return (
    <View style={styles.screen}>
      <ScreenHeader value={STRINGS.profile.title} required={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Image source={ImageAssets.manCoinDonut} style={styles.avatar} />
          </View>
          <TextComponent
            varient="bold"
            size="MMedium"
            value={user?.name ?? ''}
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={STRINGS.profile.handle}
            color={COLORS.info}
            size="Small"
          />
        </View>

        <View style={styles.card}>
          {data.map(item => (
            <TouchableOpacity
              key={item.nav}
              style={styles.row}
              onPress={() => onNavPress(item.nav)}
            >
              <View style={styles.rowIcon}>
                <FontAwesome6
                  iconStyle="solid"
                  size={18}
                  name={item.icon as any}
                  color={COLORS.brandStrong}
                />
              </View>
              <TextComponent value={item.name} color={COLORS.textPrimary} />
              <FontAwesome6
                iconStyle="solid"
                name="chevron-right"
                size={12}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  hero: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  avatarWrap: {
    width: 98,
    height: 98,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceMuted,
  },
  avatar: {
    width: 76,
    height: 76,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
