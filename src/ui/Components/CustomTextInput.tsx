import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { FC } from 'react';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { heightPercentageToDP } from '../../utils/responsive';

interface InputProp {
    left?: React.ReactNode;
    onClear?: () => void;
    right?: boolean;
}

const CustomInput:FC<InputProp & React.ComponentProps<typeof TextInput>> = ({left,onClear,right,...props}) => {
  return (
    <View style={styles.flexBox}>
        {left}
     <TextInput 
     {...props}
     style={styles.inputContainer}
     placeholderTextColor='#ccc'
     />
     <View style={styles.icon}>
        {props?.value?.length !=0 && right &&
        <TouchableOpacity>
            <FontAwesome6 name="circle-half-stroke" iconStyle="solid" size={heightPercentageToDP(1)} color={"#ccc"}/>
        </TouchableOpacity>
        }
     </View>
    </View>
  )
}

const styles = StyleSheet.create({
    icon:{
        width: "5%",
        justifyContent: "center",
        alignItems:"center",
        marginRight: 10,
    },
    inputContainer:{
        width: '70%',
        fontFamily: "500",
        fontSize: heightPercentageToDP(2),
        paddingVertical: 14,
        paddingBottom: 15,
        height: '100%',
        color: "black",
        bottom: -1
    },
    text:{
        width: '10%',
        marginLeft: 10
    },
    flexBox:{
        flexDirection:"row",
        alignItems: "center",
        justifyContent:"space-between",
        borderRadius: 10,
        borderWidth: 0.5,
        width: '100%',
        marginVertical: 10,
        backgroundColor: "#fff",
        shadowOffset: {width:1,height:1},
        shadowOpacity: 0.6,
        shadowRadius: 2,
        shadowColor: "gray",
        borderColor: "gray",
    }
})

export default CustomInput