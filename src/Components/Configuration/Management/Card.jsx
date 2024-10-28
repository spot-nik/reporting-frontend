import {Loader, Flex, Box, Divider, Text, Tooltip, Icon} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {Info} from "monday-ui-react-core/icons";
import "./Management.css";

export default function Card({title, description, info, value, prefix, isLoading}) {
    return <Box className="management-widget-box" border={Box.borders.DEFAULT}
                rounded={Box.roundeds.MEDIUM}
                backgroundColor={Box.backgroundColors.PRIMARY_BACKGROUND_COLOR}>
        <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL} style={{height: "100%"}}>
            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START} style={{width: "100%"}}>
                <Flex gap={Flex.gaps.SMALL} align={Flex.align.END}>
                    <Heading type={Heading.types.H3} className="management-card-title">{title}</Heading>
                    <Text type={Text.types.TEXT2} color={Text.colors.SECONDARY}>{description}</Text>
                    {info && <Tooltip content={info}>
                        <Icon icon={Info}/>
                    </Tooltip>}
                </Flex>
                <Divider/>
            </Flex>
            {isLoading ? <Loader size={Loader.sizes.MEDIUM}/> :
                <Flex className="management-card-body" gap={Flex.gaps.SMALL} align={Flex.align.END}>
                    <Text className="management-card-value" type={Text.types.TEXT1}
                          weight={Text.weights.MEDIUM}>{value}</Text>
                    <Text type={Text.types.TEXT1} color={Text.colors.SECONDARY}>{prefix}</Text>
                </Flex>}
        </Flex>
    </Box>
}