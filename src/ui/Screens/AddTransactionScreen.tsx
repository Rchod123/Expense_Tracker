import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ScreenHeader from '../Components/ScreenHeader';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/responsive';
import { BasicSkeleton, CustomInput } from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { TextComponent } from '../Components/TextComponent';
import { ExpenseDropDownType, ExpensesDropDown, IncomeDropDown } from '../Constants';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  cardContainer: {
    height: heightPercentageToDP(62),
    backgroundColor: 'white',
    marginHorizontal: widthPercentageToDP(4),
    position: 'absolute',
    top: heightPercentageToDP(18),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(2),
    bottom: 0,
    right: 0,
    left: 0,
  },
});

const AddTransactionScreen = () => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState<Date>(new Date());
  const [visible, setVisible] = useState(false);
  const [dropList, setDropList] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [selectedValue, setSelectedValue] = useState<ExpenseDropDownType>();
  const { params } = useRoute();

  useLayoutEffect(() => {
    setIsIncome(params?.params === 'Income');
  }, [params?.params]);

  const dropdownData = isIncome ? IncomeDropDown : ExpensesDropDown;

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(moment(selectedDate).format('YYYY-MM-DD'));
      setSelected(selectedDate);
    }
  };

  const Card = () => (
    <View style={{ marginHorizontal: widthPercentageToDP(4) }}>
      <BasicSkeleton name="Name">
        <TouchableOpacity
          onPress={() => setDropList(!dropList)}
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: widthPercentageToDP(2) }}>
            {selectedValue?.image && (
              <Image
                source={selectedValue.image}
                style={{
                  borderRadius: heightPercentageToDP(2),
                  height: heightPercentageToDP(4),
                  width: widthPercentageToDP(9),
                }}
              />
            )}
            <TextComponent value={selectedValue?.name ?? ''} />
          </View>
          <FontAwesome6
            name={dropList ? 'chevron-up' : 'chevron-down'}
            size={20}
            iconStyle="solid"
          />
        </TouchableOpacity>
      </BasicSkeleton>
      {dropList && (
        <FlatList
          data={dropdownData}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedValue(item);
                setDropList(false);
              }}
              style={{
                flexDirection: 'row',
                gap: widthPercentageToDP(4),
                paddingVertical: heightPercentageToDP(2),
                backgroundColor: '#fafafa',
                paddingHorizontal: widthPercentageToDP(4),
                marginVertical: heightPercentageToDP(0.5),
                borderRadius: heightPercentageToDP(1),
              }}
            >
              <Image
                source={item.image}
                style={{
                  height: heightPercentageToDP(3),
                  width: widthPercentageToDP(6),
                }}
              />
              <TextComponent value={item.name} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <ScreenHeader
        value={isIncome ? 'Add Income' : 'Add Expense'}
        iconName="ellipsis"
        required={false}
      />
      <View style={styles.cardContainer}>
        <Card />
        <CustomInput
          name="Amount"
          placeholder="Enter the Amount"
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        <CustomInput
          name="Date"
          placeholder="Select the date"
          value={date}
          rightType="icon"
          rightValue="calendar"
          onRightPress={() => setVisible(true)}
          onChangeText={setDate}
        />
        {!isIncome && (
          <TouchableOpacity style={{ marginHorizontal: widthPercentageToDP(4) }}>
            <BasicSkeleton name="Invoice" type="dashed">
              <View
                style={{
                  backgroundColor: 'gray',
                  height: heightPercentageToDP(2),
                  width: heightPercentageToDP(2),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: heightPercentageToDP(1),
                }}
              >
                <FontAwesome6
                  name="plus"
                  iconStyle="solid"
                  size={heightPercentageToDP(1.4)}
                />
              </View>
              <TextComponent value="Add Invoice" />
            </BasicSkeleton>
          </TouchableOpacity>
        )}
        <View style={{ marginTop: heightPercentageToDP(4), alignSelf: 'center' }}>
          <ButtonComponent
            value={isIncome ? 'Add Income' : 'Add Expense'}
            onPress={() => {}}
            type="primary"
          />
        </View>
      </View>
      {visible && (
        <Modal>
          <SafeAreaView
            style={{
              rowGap: heightPercentageToDP(5),
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
            }}
          >
            <DateTimePicker
              mode="date"
              value={selected}
              style={{ alignSelf: 'center' }}
              onChange={handleDateChange}
              maximumDate={new Date()}
              display="spinner"
            />
            <ButtonComponent
              value="Done"
              onPress={() => setVisible(false)}
              type="primary"
            />
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

export default AddTransactionScreen;
