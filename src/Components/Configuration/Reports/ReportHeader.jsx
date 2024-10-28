import {useQueryClient} from "@tanstack/react-query";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {
    Button,
    EditableText,
    Divider,
    Flex,
    Text,
    Label
} from "monday-ui-react-core";
import Owner from "./Owner.jsx";
import {DeleteReport, DuplicateReport, TakeOwnership} from "./ReportActionButtons.jsx";
import SendNowButton from "./SendNow.jsx";

export default function ReportHeader({reportId, setReport}) {
    const queryClient = useQueryClient();
    const {user} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);
    const editable = report.owner === Number(user.id);

    function generateMenu() {
        const parts = [];
        parts.push(countInsights())
        parts.push(<Divider key="header-divider-owner" className="report-modal-header-divider"
                            direction={Divider.directions.VERTICAL}/>)
        parts.push(<Owner key="report-owner" reportId={reportId}/>);

        if (!editable) {
            parts.push(<TakeOwnership key="report-takeowner" reportId={reportId}/>);
        }

        parts.push(<DuplicateReport key="report-duplicate" reportId={reportId}/>);

        if (editable) {
            parts.push(<DeleteReport key="delete-report" reportId={reportId}/>);
            parts.push(<SendNowButton key="send-now" size={Button.sizes.SMALL} report={report}/>)
        }
        return parts
    }

    function countInsights() {
        const insightsCount = (report.body?.match(/<insight\s.*?>/g) || []).length;
        return <Text key="Insight count" type={Text.types.TEXT2}>Insights count: {insightsCount}</Text>;
    }

    function ReportLabel() {
        if (!report.sender || !report.to || report.to.length === 0) {
            if (!report.sender && report.to && report.to.length !== 0) {
                return <Label isAnimationDisabled={true} text="Missing sender" color={Label.colors.NEGATIVE}/>
            }
            if (report.sender && !report.to && report.to.length === 0) {
                return <Label isAnimationDisabled={true} text="Missing recipient" color={Label.colors.NEGATIVE}/>
            }
            return <Label isAnimationDisabled={true} text="Missing sender and recipient" color={Label.colors.NEGATIVE}/>
        }
        if (report.name === "New report")
            return <Label isAnimationDisabled={true} text="Don't forget to set a name to your report"/>
    }

    return <Flex justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
        <Flex gap={Flex.gaps.SMALL}>
            <EditableText type={EditableText.types.TEXT1}
                          readOnly={!editable}
                          placeholder="New report"
                          value={report.name || ""}
                          onChange={(value) => setReport("name", value)}
                          onClick={(e) => e.stopPropagation()}/>
            <ReportLabel/>
        </Flex>
        <Flex gap={Flex.gaps.XS}>
            {generateMenu()}
        </Flex>
    </Flex>
}