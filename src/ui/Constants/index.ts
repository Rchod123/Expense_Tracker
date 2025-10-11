import { ImageSourcePropType } from "react-native"
import { ImageAssets } from "../../assets"

export type ExpenseDropDownType = {
    name: string,
    image: ImageSourcePropType,
}

export const ExpensesDropDown: Array<ExpenseDropDownType>  = [{
    name: "Youtube",
    image: ImageAssets.youtube
},
{
    name: "Netflix",
    image: ImageAssets.netflix
},
{
    name: "Amazon",
    image: ImageAssets.amazon
},
{
    name: "Outflow",
    image: ImageAssets.outflow
},
{
    name: "Transfer",
    image: ImageAssets.transfer
}
]

export const IncomeDropDown : Array<ExpenseDropDownType> = [{
    name: "Salary",
    image: ImageAssets.salary,
}, {
    name: "Inflow",
    image: ImageAssets.inflow
}, {
    name: "moneyFlow",
    image: ImageAssets.moneyFlow,
}, {
    name: "Interest",
    image: ImageAssets.interest
}]