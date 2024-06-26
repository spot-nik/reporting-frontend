import {useMutation, useQueryClient} from "@tanstack/react-query";
import {changeOwner, deleteReport, duplicateReport} from "../../../Queries/reporting.js";
import {Button, IconButton, Tooltip} from "monday-ui-react-core";
import {Delete, Duplicate} from "monday-ui-react-core/icons";

const crownLogo = <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
    <path
        d="M9.50454 4.60798C9.66002 4.53683 9.82901 4.5 10 4.5C10.171 4.5 10.34 4.53683 10.4955 4.60798C10.651 4.67913 10.7893 4.78294 10.9011 4.91234C10.9185 4.93248 10.9347 4.95358 10.9497 4.97554L13.5554 8.78235L16.1462 6.76057C16.1826 6.73213 16.2217 6.70731 16.263 6.68647C16.4589 6.58748 16.6783 6.54427 16.8971 6.56156C17.1159 6.57885 17.3258 6.65597 17.5038 6.78449C17.6817 6.91302 17.8209 7.08799 17.9061 7.29029C17.9904 7.49034 18.0187 7.70951 17.988 7.92432L17.1332 14.8819C17.0865 15.2356 16.785 15.5 16.4282 15.5H3.57184C3.21533 15.5 2.91391 15.236 2.86689 14.8826L2.0121 7.97663C1.9813 7.76167 2.00955 7.54233 2.09388 7.34213C2.17909 7.13983 2.31829 6.96485 2.49624 6.83633C2.67419 6.70781 2.88406 6.63069 3.10289 6.6134C3.32172 6.59611 3.54109 6.63932 3.73701 6.73831C3.77579 6.7579 3.81269 6.781 3.84725 6.80732L6.44312 8.78455L9.05026 4.97554C9.06529 4.95358 9.08154 4.93248 9.09894 4.91234C9.21071 4.78294 9.34905 4.67913 9.50454 4.60798ZM10 6.10617L12.5148 9.7802C12.6067 9.91726 12.7261 10.0337 12.8655 10.1222C13.0067 10.2118 13.1652 10.2707 13.3307 10.295C13.4961 10.3193 13.6648 10.3084 13.8258 10.2632C13.9825 10.2191 14.1284 10.1435 14.2546 10.0409L16.5058 8.2841L15.8047 14.0777H4.19465L3.49344 8.32579L5.74941 10.0441C5.87469 10.145 6.01918 10.2196 6.17417 10.2632C6.33517 10.3084 6.50389 10.3193 6.66935 10.295C6.8348 10.2707 6.99329 10.2118 7.13449 10.1222C7.27388 10.0337 7.39333 9.91724 7.48527 9.78017L10 6.10617Z"
        fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
</svg>

export function DeleteReport({reportId, onClick}) {
    const queryClient = useQueryClient();

    const {mutate: deleteReportMutation} = useMutation({
        mutationFn: () => deleteReport({reportId: reportId}),
        onSuccess: () => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return oldData.filter((oldReport) => oldReport.id !== reportId);
            });
        }
    });

    return <IconButton key="delete-report" icon={Delete}
                       size={IconButton.sizes.SMALL}
                       onClick={(e) => {
                           e.stopPropagation();
                           if (onClick) onClick();
                           deleteReportMutation();
                       }}/>
}

export function DuplicateReport({reportId, onClick}) {
    const queryClient = useQueryClient();

    const {mutate: duplicateMutation} = useMutation({
        mutationFn: () => duplicateReport({reportId: reportId}),
        onSuccess: (newReport) => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return [
                    ...oldData,
                    newReport
                ];
            });
        }
    });

    return <IconButton key="duplicate-report" icon={Duplicate}
                       size={IconButton.sizes.SMALL}
                       onClick={(e) => {
                           e.stopPropagation();
                           if (onClick) onClick();
                           duplicateMutation();
                       }}/>
}

export function TakeOwnership({reportId, onClick}) {
    const queryClient = useQueryClient();

    const {mutate: changeOwnerMutation} = useMutation({
        mutationFn: () => changeOwner({reportId: reportId}),
        onSuccess: (newOwner) => {
            queryClient.setQueryData(["reports"], (oldData) => {
                const newData = [...oldData];
                const reportIndex = newData.findIndex((report) => report.id === reportId);
                const newReport = {...newData[reportIndex]};
                newReport.owner = newOwner;
                newReport.sender = null;
                newData[reportIndex] = newReport;
                return newData;
            });
        }
    });

    return <Tooltip key="take-report-ownership"
                    content="When taking ownership you will need to select the report sender again">
        <Button kind={Button.kinds.TERTIARY}
                size={IconButton.sizes.SMALL}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onClick) onClick();
                    changeOwnerMutation();
                }}>
            {crownLogo}
        </Button>
    </Tooltip>
}