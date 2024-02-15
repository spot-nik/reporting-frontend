import {Space, Typography} from "antd";

const {Text} = Typography;

export const FUNCTIONS = [
    {
        title: "Sum",
        value: "SUM",
        description: "Sum of the values",
        criteria: ["column"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Sum</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Average",
        value: "AVERAGE",
        description: "Average of the values",
        criteria: ["column"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Average</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Median",
        value: "MEDIAN",
        description: "Median of the values",
        criteria: ["column"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Median</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Minimum",
        value: "MIN",
        description: "Minimum value",
        criteria: ["column"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Minimum</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Maximum",
        value: "MAX",
        description: "Maximum value",
        criteria: ["column"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Maximum</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Count items",
        value: "COUNT_ITEMS",
        description: "Number of items",
        criteria: [],
        sentence: () => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items</Text>
        </Space>
    },
    {
        title: "Count items created",
        value: "COUNT_CREATED_ITEMS",
        description: "Number of items created",
        criteria: ["timespan"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items created</Text>
            {data.timespan ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.timespan}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>in time</Text>}
        </Space>
    },
    {
        title: "Count changed items",
        value: "COUNT_CHANGED_ITEMS",
        description: "Number of items changed",
        criteria: ["column", "value", "timespan"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items</Text>
            <Text style={{fontSize: "24px"}}>where</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text> :
                <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            <Text style={{fontSize: "24px"}}>changed to</Text>
            {data.value ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.value}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>value</Text>}
            {data.timespan ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.timespan}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>in time</Text>}
        </Space>
    }
]