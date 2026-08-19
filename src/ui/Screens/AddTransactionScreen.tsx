import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import moment from 'moment';
import { ImageAssets } from '../../assets';
import type { Category } from '../../types/domain';
import type { RootStackParamList } from '../../types/navigation';
import ScreenHeader from '../Components/ScreenHeader';
import { BasicSkeleton, CustomInput } from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from '../Components/TextComponent';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import { useQuery, useRealm } from '@realm/react';
import { Category as Categories } from '../../db/schema/Categories';
import { useRealmServices } from '../../utils/storageFunctions';
import { pullCategoriesFromMongo } from '../../db/backend/apiCall';
import { API_ENDPOINT } from '../../config/api';
import NetInfo from '@react-native-community/netinfo';
import {CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { COLORS, STRINGS } from '../Constants';

const styles = StyleSheet.create({
  cardContainer: {
    height: heightPercentageToDP(62),
    backgroundColor: COLORS.surface,
    marginHorizontal: widthPercentageToDP(4),
    position: 'absolute',
    top: heightPercentageToDP(18),
    elevation: 2,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(2),
    bottom: 0,
    right: 0,
    left: 0,
  },
  categoryField: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPercentageToDP(2),
  },
  categoryImage: {
    borderRadius: heightPercentageToDP(2),
    height: heightPercentageToDP(4),
    width: widthPercentageToDP(9),
  },
  categoryOption: {
    flexDirection: 'row',
    gap: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(2),
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: widthPercentageToDP(4),
    marginVertical: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(1),
  },
  optionImage: {
    height: heightPercentageToDP(3),
    width: widthPercentageToDP(6),
  },
  categoryList: { maxHeight: heightPercentageToDP(27) },
  customCategoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.info,
  },
  customCategoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandLight,
  },
  submit: { marginTop: heightPercentageToDP(4), alignSelf: 'center' },
  dateSheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },
  dateSheet: {
    padding: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: COLORS.surface,
  },
  dateSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  dateAction: {
    minWidth: 86,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.info,
  },
  customSheetBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.overlay,
  },
  customSheet: { borderRadius: 24, padding: 20, backgroundColor: COLORS.surface },
  customSheetCopy: { marginTop: 5, marginBottom: 18 },
  customCategoryInput: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  customActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  customAction: {
    minWidth: 86,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const today = () => moment().format('YYYY-MM-DD');

const AddTransactionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const relam = useRealm();

  const { params } =
    useRoute<RouteProp<RootStackParamList, 'AddTransaction'>>();

  const category = useQuery(Categories).filtered(
    `transactionType == '${params.type}'`,
  );
  //const category = useQuery(Categories);
  // console.log(category.toJSON(),params.type)
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isCategoryListVisible, setCategoryListVisible] = useState(false);
  const [isCustomCategoryVisible, setCustomCategoryVisible] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [isCreatingCategory, setCreatingCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [isLoadingCategories, setLoadingCategories] = useState(false);
  const [onEllipse, setOnEllipse] = useState(false);
  const { createExpense, createCategory } = useRealmServices();
  const [isSaving, setSaving] = useState(false);
  const isIncome = params.type === 'income';
  const [_imageUri, setImageUri] = useState<string | null>(null);
  useEffect(() => {
    if (category.length > 0) {
      setCategories(
        category.map(item => ({
          id: item._id.toString().charCodeAt(0),
          name: item.name,
          type: item.transactionType as Category['type'],
          iconKey: item.ui,
          ui: item.ui as Category['ui'],
          color: '#176B65',
          createdAt: new Date().toISOString(),
        })),
      );
      setLoadingCategories(false);
      return;
    }

    let cancelled = false;

    const loadCategoriesFromMongo = async () => {
      setLoadingCategories(true);
      const netState = await NetInfo.fetch();
      if (
        netState.isConnected &&
        netState.isInternetReachable !== false &&
        !cancelled
      ) {
        await pullCategoriesFromMongo(relam, API_ENDPOINT);
      }
      if (!cancelled) {
        setLoadingCategories(false);
      }
    };

    loadCategoriesFromMongo();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDateChange = (event: DateTimePickerEvent, nextDate?: Date) => {
    if (Platform.OS === 'android') {
      setDatePickerVisible(false);
    }

    console.log(nextDate);
    if (event.type === 'set' && nextDate) {
      setSelectedDate(nextDate);
      console.log(moment(nextDate).format('YYYY-MM-DD'));
      setDate(moment(nextDate).format('YYYY-MM-DD'));
    }
  };
 

  const handlePickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert(STRINGS.common.error, response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri ?? null);
      }
    });
  };

  const handleTakePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert(STRINGS.common.error, response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri ?? null);
      }
    });
  };

  const submitTransaction = async () => {
    const parsedAmount = Number(amount.replace(/,/g, '').trim());
    if (!selectedCategory) {
      Alert.alert(
        STRINGS.addTransaction.chooseCategoryErrorTitle,
        STRINGS.addTransaction.chooseCategoryErrorMessage,
      );
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        STRINGS.addTransaction.invalidAmountTitle,
        STRINGS.addTransaction.invalidAmountMessage,
      );
      return;
    }

    setSaving(true);
    try {
      createExpense({
        title: selectedCategory.name || STRINGS.addTransaction.defaultCategory,
        amount: Math.round(parsedAmount * 100) || 0,
        category: params.type || STRINGS.addTransaction.defaultCategory,
        date: date,
        ui: selectedCategory.ui,
      });
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert(
        STRINGS.addTransaction.saveErrorTitle,
        STRINGS.addTransaction.saveErrorMessage,
      );
    } finally {
      setSaving(false);
    }
  };

  const createCustomCategory = async () => {
    try {
      setCreatingCategory(true);
      createCategory({
        name: customCategoryName,
        ui: params.type === 'expense' ? 'outflow' : 'inflow',
        transactionType: params.type,
        type: 'image',
      });
      setCustomCategoryVisible(false);
    } catch (err) {
      console.log(err);
      Alert.alert(STRINGS.addTransaction.categoryLoadError);
    } finally {
      setCreatingCategory(false);
    }
  };

  const onEllipseClick = () => {
    setOnEllipse(true);
  };

  const categoryAsset = selectedCategory
    ? ImageAssets[
        (selectedCategory.iconKey ??
          selectedCategory.ui) as keyof typeof ImageAssets
      ]
    : undefined;

  return (
    <View style={{ backgroundColor: COLORS.surface, flex: 1 }}>
      <ScreenHeader
        value={isIncome ? STRINGS.addTransaction.addIncome : STRINGS.addTransaction.addExpense}
        iconName="ellipsis"
        required={false}
        onPress={onEllipseClick}
      />
      <View style={styles.cardContainer}>
        <View style={{ marginHorizontal: widthPercentageToDP(4) }}>
          <BasicSkeleton name={STRINGS.addTransaction.category}>
            <TouchableOpacity
              disabled={isLoadingCategories}
              onPress={() => setCategoryListVisible(value => !value)}
              style={styles.categoryField}
            >
              <View style={styles.categoryLeft}>
                {categoryAsset && (
                  <Image source={categoryAsset} style={styles.categoryImage} />
                )}
                <TextComponent
                  value={
                    selectedCategory?.name ??
                    (isLoadingCategories
                      ? STRINGS.addTransaction.loadingCategories
                      : STRINGS.addTransaction.selectCategory)
                  }
                  color={selectedCategory ? 'black' : '#8A9595'}
                />
              </View>
              <FontAwesome6
                name={isCategoryListVisible ? 'chevron-up' : 'chevron-down'}
                size={18}
                iconStyle="solid"
                color="#52605F"
              />
            </TouchableOpacity>
          </BasicSkeleton>
          {isCategoryListVisible && (
            <FlatList
              data={categories}
              style={styles.categoryList}
              keyExtractor={item => String(item.id + item.name)}
              renderItem={({ item }) => {
                const asset = ImageAssets[item.ui as keyof typeof ImageAssets];
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(item);
                      setCategoryListVisible(false);
                    }}
                    style={styles.categoryOption}
                  >
                    {asset && (
                      <Image source={asset} style={styles.optionImage} />
                    )}
                    <TextComponent value={item.name} />
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {isCategoryListVisible && (
            <TouchableOpacity
              onPress={() => {
                setCategoryListVisible(false);
                setCustomCategoryVisible(true);
              }}
              style={styles.customCategoryOption}
            >
              <View style={styles.customCategoryIcon}>
                <FontAwesome6
                  name="plus"
                  iconStyle="solid"
                  size={13}
                  color="#176B65"
                />
              </View>
              <View>
                <TextComponent
                  value={STRINGS.addTransaction.customCategory}
                  size="Small"
                  varient="bold"
                  color={COLORS.brandStrong}
                />
                <TextComponent
                  value={`${STRINGS.addTransaction.categorySavedAs} ${
                    isIncome ? STRINGS.common.income : STRINGS.common.expense
                  } category`}
                  size="ExtraSmall"
                  color={COLORS.textMuted}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
          <CustomInput
            name={STRINGS.addTransaction.enterAmount}
          placeholder={STRINGS.addTransaction.enterAmount}
          value={amount}
          keyboardType="decimal-pad"
          onChangeText={setAmount}
        />
          <CustomInput
            name={STRINGS.addTransaction.selectDate}
          placeholder={STRINGS.addTransaction.selectDate}
          value={date}
          rightType="icon"
          rightValue="calendar"
          onRightPress={() => setDatePickerVisible(true)}
          onChangeText={setDate}
        />
        <View style={styles.submit}>
          <ButtonComponent
            value={
              isSaving
                ? STRINGS.addTransaction.saving
                : isIncome
                  ? STRINGS.addTransaction.addIncome
                  : STRINGS.addTransaction.addExpense
            }
            onPress={submitTransaction}
            type="primary"
            disabled={isSaving || isLoadingCategories}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

        
        <TouchableOpacity
          style={{
            alignItems: 'center',
            paddingVertical: heightPercentageToDP(3),
          }}
          onPress={handleTakePhoto}
        >
          <FontAwesome6
            name="camera"
            iconStyle="solid"
            color={'black'}
            size={heightPercentageToDP(3)}
          />
          <TextComponent value={STRINGS.addTransaction.openCamera} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            paddingVertical: heightPercentageToDP(3),
          }}
          onPress={handlePickImage}
        >
          <FontAwesome6
            name="upload"
            iconStyle="solid"
            color={'black'}
            size={heightPercentageToDP(3)}
          />
          <TextComponent value={STRINGS.addTransaction.uploadImage} />
        </TouchableOpacity>
        </View>
      </View>

      {isDatePickerVisible && Platform.OS === 'android' && (
        <DateTimePicker
          mode="date"
          value={selectedDate}
          onChange={handleDateChange}
          maximumDate={new Date()}
          display="default"
        />
      )}

      {isDatePickerVisible && Platform.OS === 'ios' && (
        <Modal
          transparent
          animationType="slide"
          visible={isDatePickerVisible}
          onRequestClose={() => setDatePickerVisible(false)}
        >
          <SafeAreaView style={styles.dateSheetBackdrop}>
            <View style={styles.dateSheet}>
              <DateTimePicker
                mode="date"
                value={selectedDate}
                onChange={handleDateChange}
                maximumDate={new Date()}
                display="spinner"
              />
              <View style={styles.dateActions}>
                <TouchableOpacity
                  style={styles.dateAction}
                  onPress={() => setDatePickerVisible(false)}
                >
                  <TextComponent
                    value={STRINGS.common.done}
                    size="Small"
                    varient="bold"
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      )}
      <Modal
        transparent
        animationType="fade"
        visible={isCustomCategoryVisible}
        onRequestClose={() => setCustomCategoryVisible(false)}
      >
        <View style={styles.customSheetBackdrop}>
          <View style={styles.customSheet}>
            <TextComponent
              value={STRINGS.addTransaction.customSheetTitle}
              size="MMedium"
              varient="bold"
            />
            <View style={styles.customSheetCopy}>
              <TextComponent
                value={`${STRINGS.addTransaction.categorySavedAs} ${
                    isIncome ? STRINGS.common.income : STRINGS.common.expense
                  } category.`}
                size="Small"
                color="#62716F"
              />
            </View>
            <TextInput
              autoFocus
              value={customCategoryName}
              onChangeText={setCustomCategoryName}
              placeholder={STRINGS.addTransaction.categoryNamePlaceholder}
              placeholderTextColor={COLORS.textMuted}
              style={styles.customCategoryInput}
              returnKeyType="done"
              onSubmitEditing={createCustomCategory}
            />
            <View style={styles.customActions}>
              <TouchableOpacity
                style={styles.customAction}
                disabled={isCreatingCategory}
                onPress={() => setCustomCategoryVisible(false)}
              >
                <TextComponent
                  value={STRINGS.common.cancel}
                  size="Small"
                  varient="medium"
                  color={COLORS.info}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.customAction,
                  {
                    backgroundColor: COLORS.info,
                    opacity: isCreatingCategory ? 0.6 : 1,
                  },
                ]}
                disabled={isCreatingCategory}
                onPress={createCustomCategory}
              >
                <TextComponent
                  value={
                    isCreatingCategory
                      ? STRINGS.addTransaction.saving
                      : STRINGS.common.save
                  }
                  size="Small"
                  varient="bold"
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        animationType="fade"
        visible={onEllipse}
        onRequestClose={() => setOnEllipse(false)}
      >
        <View style={styles.customSheetBackdrop}>
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(undefined);
              setAmount('');
              setDate(today);
              setOnEllipse(false);
            }}
          >
            <View style={styles.customSheet}>
              <TextComponent value={STRINGS.common.reset} />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default AddTransactionScreen;
