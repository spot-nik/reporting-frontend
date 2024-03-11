import {Text, List, ListItem, DialogContentContainer} from 'monday-ui-react-core';

const CONDITION_MAP = {
    group: [
        {label: "is", value: "is"}
    ],
    status: [
        {label: "is", value: "any_of"},
        {label: "is not", value: "not_any_of"}
    ],
    people: [
        {label: "is", value: "any_of"},
        {label: "is not", value: "not_any_of"}
    ],
    dropdown: [
        {label: "is", value: "any_of"},
        {label: "is not", value: "not_any_of"}
    ],
    date: [
        {label: "is", value: "any_of"},
        {label: "is not", value: "not_any_of"},
        {label: "is before", value: "greater_than_or_equals"},
        {label: "is after", value: "lower_than_or_equal"},
    ]
}

export default function ConditionCombobox({setHover, value, setValue, columnType}) {
    function onClick(value) {
        setValue(value)
    }

    return <DialogContentContainer>
        {!columnType
            ? <Text type={Text.types.TEXT2} style={{padding: "5px 15px"}}>Select column first</Text>
            : <List className="insight-list" component={List.components.DIV}>
                {CONDITION_MAP[columnType].map((condition) => {
                    return <ListItem key={condition.value}
                                     className="insight-list-item"
                                     onHover={() => setHover(condition.label)}
                                     onClick={() => onClick(condition)}
                                     selected={value?.value === condition.value}>
                        {condition.label}
                    </ListItem>
                })}
            </List>}
    </DialogContentContainer>
}