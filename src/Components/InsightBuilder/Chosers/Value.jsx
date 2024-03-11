import {Text, List, ListItem, DialogContentContainer, Loader} from 'monday-ui-react-core';
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns, getBoardGroups, getBoardUsers} from "../../../Queries/monday.js";
import {useEffect, useState} from "react";

export default function ValueCombobox({setHover, value, setValue, includeAnything, selectedColumn}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [options, setOptions] = useState([]);

    const {data: column, isLoading: isLoadingColumn} = useQuery({
        queryKey: ["column", selectedColumn?.value],
        queryFn: () => getBoardColumns({boardId, columnIds: [selectedColumn?.value]}),
        enabled: ["status", "dropdown"].includes(selectedColumn.type)
    });

    const {data: subscribers, isLoading: isLoadingSubscribers} = useQuery({
        queryKey: ["subscribers", boardId],
        queryFn: () => getBoardUsers({boardId}),
        enabled: selectedColumn.type === "people"
    });

    const {data: groups, isLoading: isLoadingGroups} = useQuery({
        queryKey: ["groups", boardId],
        queryFn: () => getBoardGroups({boardId}),
        enabled: selectedColumn.type === "group"
    })


    const optionsGeneratorMapping = {
        people: generatePeopleOptions,
        status: generateStatusOptions,
        dropdown: generateDropdownOptions,
        group: generateGroupOptions,
        date: generateDateOptions
    }

    function generatePeopleOptions() {
        return subscribers.map((subscriber) => ({
            label: subscriber.name,
            value: subscriber.id
        }));
    }

    function generateStatusOptions() {
        const tempOptions = [];
        const columnSettings = JSON.parse(column[0].settings_str);
        Object.keys(columnSettings.labels).forEach((key) => {
            const index = Number(key);
            let label = columnSettings?.labels[index];
            if (label === "") {
                if (index === 5) {
                    label = "(Default)";
                } else {
                    return;
                }
            }
            tempOptions.push({label: label, value: index});
        });
        if (!Object.keys(columnSettings.labels).includes("5")) {
            tempOptions.push({label: "(Default)", value: 5});
        }
        return tempOptions;
    }

    function generateDropdownOptions() {
        const columnSettings = JSON.parse(column[0].settings_str);
        return columnSettings.labels?.map((label) => ({label: label.name, value: label.id}));
    }

    function generateGroupOptions() {
        return groups.map((group) => ({label: group.title, value: group.id}));
    }

    function generateDateOptions() {
        return [
            {label: "Today", value: "TODAY"},
            {label: "Yesterday", value: "YESTERDAY"},
            {label: "Tomorrow", value: "TOMORROW"},
            {label: "This week", value: "THIS_WEEK"},
            {label: "Last week", value: "ONE_WEEK_AGO"},
            {label: "Next week", value: "ONE_WEEK_FROM_NOW"},
            {label: "This month", value: "THIS_MONTH"},
            {label: "Last month", value: "ONE_MONTH_AGO"},
            {label: "Next month", value: "ONE_MONTH_FROM_NOW"},
            {label: "Past dates", value: "PAST_DATETIME"},
            {label: "Future dates", value: "FUTURE_DATETIME"},
            {label: "Blank", value: "$$$blank$$$"}
        ]
    }

    useEffect(() => {
        if (column?.length > 0 || subscribers || groups) {
            const tempOptions = [];
            if (includeAnything) {
                tempOptions.push({label: "Anything", value: "anything"});
            }
            setOptions(tempOptions.concat(optionsGeneratorMapping[selectedColumn.type]()));
        }
    }, [column, subscribers, groups]);

    function isLoading() {
        return isLoadingColumn || isLoadingSubscribers || isLoadingGroups;
    }

    function onClick(value) {
        setValue(value);
    }

    return <DialogContentContainer>
        {!selectedColumn
            ? <Text type={Text.types.TEXT2} style={{padding: "5px 15px"}}>Select column first</Text>
            : isLoading()
                ? <Loader size={Loader.sizes.SMALL}/>
                : <List className="insight-list" component={List.components.DIV}>
                    {options.map((option) => {
                        return <ListItem key={option.value}
                                         className="insight-list-item"
                                         onHover={() => setHover(option.label)}
                                         onClick={() => onClick(option)}
                                         selected={value?.value === option.value}>
                            {option.label}
                        </ListItem>
                    })}
                </List>}
    </DialogContentContainer>
}