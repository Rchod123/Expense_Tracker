import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../Components/ScreenHeader';
import { ImageAssets } from '../../assets';
import { TextComponent } from '../Components/TextComponent';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { RootStackParamList } from '../../types/navigation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';
import { useTheme } from '../../context/themeContext';
import { heightPercentageToDP } from '../../utils/responsive';
import { useQuery } from '@realm/react';
import { User } from '../../db/schema/User';

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
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const UserDetails = useQuery(User)[0];
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
    <View style={[styles.screen, { backgroundColor: colors.surfaceMuted }]}>
      <ScreenHeader value={STRINGS.profile.title} showBackButton={false} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero,{backgroundColor: colors.surfaceMuted}]}>
          <View style={[styles.avatarWrap,{ backgroundColor: colors.surfaceMuted }]}>
            <Image source={ImageAssets.manCoinDonut} style={styles.avatar} />
          </View>
          <TextComponent
            varient="bold"
            size="MMedium"
            value={UserDetails?.name ?? ''}
            color={COLORS.textPrimary}
          />
          <TextComponent
            value={UserDetails?.tag}
            color={COLORS.info}
            size="Small"
          />
        </View>

      

        <View style={[styles.card,{ backgroundColor: colors.surface }]}>
          {data.map(item => (
            <TouchableOpacity
              key={item.nav}
              style={styles.row}
              onPress={() => onNavPress(item.nav)}
            >
             <View style={{flexDirection:"row",alignItems: "center",gap: heightPercentageToDP(2)}}>
              <View style={styles.rowIcon}>
                <FontAwesome6
                  iconStyle="solid"
                  size={18}
                  name={item.icon as any}
                  color={COLORS.brandStrong}
                />
              </View>
              <TextComponent value={item.name} color={COLORS.textPrimary} />
              </View> 
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
  },
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.xl,
    height: heightPercentageToDP(50)
  },
  hero: {
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
  },
  avatar: {
    width: 76,
    height: 76,
  },
  card: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
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
