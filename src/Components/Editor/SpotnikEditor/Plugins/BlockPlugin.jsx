import React from "react";
import {$createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection} from "lexical";
import {$setBlocksType} from "@lexical/selection";
import {$createHeadingNode, $isHeadingNode} from "@lexical/rich-text";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {
    insertList,
    removeList
} from "@lexical/list";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {$isExtendedListNode, $getExtendedListNode} from "../Nodes/ExtendedListNode.jsx";
import {Flex, Button, Dialog, DialogContentContainer, List, ListItem, Text} from "monday-ui-react-core";

const SUPPORTED_BLOCK_TYPES = [
    {
        key: "paragraph",
        title: "Text",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path d="M15 6.14595H11.2042V15.785H8.82029V6.14595H5.32385V4.21497L15 4.21497V6.14595Z"
                  fill="currentColor"></path>
        </svg>,
        createNodeFunction: ({selection}) => $setBlocksType(selection, () => $createParagraphNode()),
        typeFunction: $isParagraphNode
    },
    {
        key: "h1",
        title: "Large heading",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path
                d="M11.577 15.6453H9.25066V10.8065H4.71429V15.6453H2.38794V4.35474H4.71429V8.92988H9.25066V4.35474H11.577V15.6453zM17.6122 15.6453H16.0115V9.47491L14.1005 10.0676V8.76593L17.4405 7.56952H17.6122V15.6453z"
                fill="currentColor"></path>
        </svg>,
        createNodeFunction: ({selection}) => $setBlocksType(selection, () => $createHeadingNode("h1")),
        typeFunction: $isHeadingNode
    },
    {
        key: "h2",
        title: "Small heading",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path
                d="M10.7501 15.5924H8.44548V10.7989H3.95155V15.5924H1.64697V4.40753H3.95155V8.93987H8.44548V4.40753H10.7501V15.5924zM18.353 15.5924H12.8768V14.506L15.4613 11.7515C15.8161 11.3637 16.0777 11.0253 16.2459 10.7363 16.4179 10.4474 16.5038 10.173 16.5038 9.91328 16.5038 9.55845 16.4142 9.28043 16.2349 9.07924 16.0557 8.87439 15.7996 8.77196 15.4668 8.77196 15.1083 8.77196 14.8248 8.89634 14.6163 9.14508 14.4114 9.39017 14.309 9.71391 14.309 10.1163H12.7177C12.7177 9.62978 12.833 9.18532 13.0634 8.78294 13.2975 8.38055 13.6268 8.06596 14.0511 7.83916 14.4754 7.6087 14.9565 7.49347 15.4942 7.49347 16.3173 7.49347 16.9556 7.69101 17.4092 8.08608 17.8664 8.48115 18.0951 9.039 18.0951 9.75964 18.0951 10.1547 17.9926 10.5571 17.7878 10.9668 17.5829 11.3765 17.2318 11.8539 16.7343 12.3989L14.918 14.3139H18.353V15.5924z"
                fill="currentColor"></path>
        </svg>,
        createNodeFunction: ({selection}) => $setBlocksType(selection, () => $createHeadingNode("h2")),
    },
    {
        key: "number",
        title: "Numbered list",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <path
                d="M4.31262 13.9836C4.23983 13.9563 4.16084 13.9498 4.08458 13.965C4.00832 13.9802 3.93783 14.0164 3.88109 14.0696C3.82435 14.1228 3.78362 14.1907 3.7635 14.2659C3.69207 14.5326 3.41793 14.6909 3.15119 14.6195C2.88444 14.5481 2.72611 14.2739 2.79754 14.0072C2.86592 13.7518 3.00441 13.5207 3.19733 13.3399C3.39026 13.1591 3.62992 13.0359 3.8892 12.9843C4.14849 12.9326 4.41706 12.9545 4.66453 13.0476C4.912 13.1406 5.1285 13.3011 5.28954 13.5107C5.45057 13.7204 5.54972 13.971 5.57576 14.2341C5.60181 14.4972 5.55371 14.7623 5.43691 14.9995C5.38537 15.1042 5.32136 15.2015 5.24664 15.2897C5.32092 15.3771 5.38466 15.4736 5.43613 15.5774C5.55343 15.8138 5.60234 16.0784 5.57735 16.3411C5.55235 16.6039 5.45444 16.8545 5.29466 17.0645C5.13487 17.2746 4.91957 17.4359 4.67303 17.5302C4.42649 17.6245 4.15851 17.648 3.89931 17.5981C3.64011 17.5482 3.40001 17.4269 3.20607 17.2479C3.01213 17.0688 2.87207 16.8391 2.80168 16.5847C2.72804 16.3186 2.8841 16.0432 3.15024 15.9695C3.41638 15.8959 3.69183 16.0519 3.76547 16.3181C3.78617 16.3929 3.82737 16.4605 3.88441 16.5131C3.94145 16.5658 4.01207 16.6015 4.0883 16.6161C4.16454 16.6308 4.24335 16.6239 4.31587 16.5962C4.38838 16.5684 4.4517 16.521 4.4987 16.4592C4.54569 16.3974 4.57449 16.3237 4.58184 16.2464C4.58919 16.1691 4.57481 16.0913 4.54031 16.0218C4.50581 15.9523 4.45256 15.8937 4.38658 15.8528C4.32059 15.8119 4.24449 15.7903 4.16686 15.7903C3.89074 15.7904 3.66679 15.5667 3.66663 15.2906C3.66647 15.0145 3.89016 14.7905 4.16628 14.7903C4.16632 14.7903 4.16636 14.7903 4.1664 14.7903C4.24412 14.7902 4.32027 14.7684 4.38624 14.7273C4.45225 14.6862 4.50544 14.6275 4.53979 14.5577C4.57414 14.488 4.58829 14.41 4.58063 14.3326C4.57297 14.2552 4.54381 14.1815 4.49644 14.1198C4.44908 14.0582 4.3854 14.011 4.31262 13.9836Z"
                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            <path d="M7.60004 5.53845H17.2923M7.60004 10.3846H17.2923M7.60004 15.2308H17.2923" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path
                d="M3.25 9.79032C3.25 9.54721 3.34658 9.31405 3.51849 9.14214C3.69039 8.97023 3.92355 8.87366 4.16667 8.87366C4.40978 8.87366 4.64294 8.97023 4.81485 9.14214C4.98676 9.31405 5.08333 9.54721 5.08333 9.79032C5.08343 10.087 4.98257 10.375 4.79733 10.6068L4.02367 11.1152L3.25 11.6237H5.08333"
                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            <path
                d="M3.20001 3.5C2.92387 3.5 2.70001 3.72386 2.70001 4C2.70001 4.27614 2.92387 4.5 3.20001 4.5H3.70001V6.5H3.25C2.97386 6.5 2.75 6.72386 2.75 7C2.75 7.27614 2.97386 7.5 3.25 7.5H4.20001H5.08333C5.35948 7.5 5.58333 7.27614 5.58333 7C5.58333 6.72386 5.35948 6.5 5.08333 6.5H4.70001V4.375C4.70001 4.0889 4.54783 3.85553 4.35357 3.70983C4.16206 3.5662 3.92593 3.5 3.70001 3.5H3.20001Z"
                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>,
        createNodeFunction: ({editor, selectedBlockType}) => {
            const selection = $getSelection();
            const node = $getExtendedListNode(selection.getNodes()[0]);
            if (node) {
                if (node.getListType() !== "number") {
                    node.setListType("number");
                }
            } else {
                if (selectedBlockType.key === "number") {
                    removeList(editor);
                } else {
                    insertList(editor, "number")
                }
            }
        },
        appearOutside: true,
    },
    {
        key: "bullet",
        title: "Bullet list",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <g fill="currentColor">
                <path
                    d="M3 5.53846C3 5.68127 3.05673 5.81823 3.15771 5.91921C3.25869 6.02019 3.39565 6.07692 3.53846 6.07692C3.68127 6.07692 3.81823 6.02019 3.91921 5.91921C4.02019 5.81823 4.07692 5.68127 4.07692 5.53846C4.07692 5.39565 4.02019 5.25869 3.91921 5.15771C3.81823 5.05673 3.68127 5 3.53846 5C3.39565 5 3.25869 5.05673 3.15771 5.15771C3.05673 5.25869 3 5.39565 3 5.53846V5.53846Z"></path>
                <path
                    d="M2.62738 4.62738C2.86901 4.38575 3.19674 4.25 3.53846 4.25 3.88018 4.25 4.20791 4.38575 4.44954 4.62738 4.69117 4.86902 4.82692 5.19674 4.82692 5.53846 4.82692 5.88018 4.69117 6.20791 4.44954 6.44954 4.20791 6.69117 3.88018 6.82692 3.53846 6.82692 3.19674 6.82692 2.86901 6.69117 2.62738 6.44954 2.38575 6.20791 2.25 5.88018 2.25 5.53846 2.25 5.19674 2.38575 4.86902 2.62738 4.62738zM3.53846 5.75C3.59457 5.75 3.64837 5.72771 3.68804 5.68804 3.72771 5.64837 3.75 5.59457 3.75 5.53846 3.75 5.48236 3.72771 5.42855 3.68804 5.38888 3.64837 5.34921 3.59457 5.32692 3.53846 5.32692 3.48236 5.32692 3.42855 5.34921 3.38888 5.38888 3.34921 5.42855 3.32692 5.48236 3.32692 5.53846 3.32692 5.59457 3.34921 5.64837 3.38888 5.68804 3.42855 5.72771 3.48236 5.75 3.53846 5.75zM6.55769 5.53845C6.55769 5.12424 6.89348 4.78845 7.30769 4.78845H17C17.4142 4.78845 17.75 5.12424 17.75 5.53845 17.75 5.95267 17.4142 6.28845 17 6.28845H7.30769C6.89348 6.28845 6.55769 5.95267 6.55769 5.53845z"
                    fillRule="evenodd" clipRule="evenodd"></path>
                <path
                    d="M3 10.3846C3 10.5274 3.05673 10.6644 3.15771 10.7654C3.25869 10.8663 3.39565 10.9231 3.53846 10.9231C3.68127 10.9231 3.81823 10.8663 3.91921 10.7654C4.02019 10.6644 4.07692 10.5274 4.07692 10.3846C4.07692 10.2418 4.02019 10.1048 3.91921 10.0039C3.81823 9.90288 3.68127 9.84615 3.53846 9.84615C3.39565 9.84615 3.25869 9.90288 3.15771 10.0039C3.05673 10.1048 3 10.2418 3 10.3846V10.3846Z"></path>
                <path
                    d="M2.62738 9.47353C2.86901 9.23189 3.19674 9.09615 3.53846 9.09615 3.88018 9.09615 4.20791 9.23189 4.44954 9.47353 4.69117 9.71516 4.82692 10.0429 4.82692 10.3846 4.82692 10.7263 4.69117 11.0541 4.44954 11.2957 4.20791 11.5373 3.88018 11.6731 3.53846 11.6731 3.19674 11.6731 2.86901 11.5373 2.62738 11.2957 2.38575 11.0541 2.25 10.7263 2.25 10.3846 2.25 10.0429 2.38575 9.71516 2.62738 9.47353zM3.53846 10.5961C3.59457 10.5961 3.64837 10.5739 3.68804 10.5342 3.72771 10.4945 3.75 10.4407 3.75 10.3846 3.75 10.3285 3.72771 10.2747 3.68804 10.235 3.64837 10.1954 3.59457 10.1731 3.53846 10.1731 3.48236 10.1731 3.42855 10.1954 3.38888 10.235 3.34921 10.2747 3.32692 10.3285 3.32692 10.3846 3.32692 10.4407 3.34921 10.4945 3.38888 10.5342 3.42855 10.5739 3.48236 10.5961 3.53846 10.5961zM6.55769 10.3846C6.55769 9.9704 6.89348 9.63461 7.30769 9.63461H17C17.4142 9.63461 17.75 9.9704 17.75 10.3846 17.75 10.7988 17.4142 11.1346 17 11.1346H7.30769C6.89348 11.1346 6.55769 10.7988 6.55769 10.3846z"
                    fillRule="evenodd" clipRule="evenodd"></path>
                <path
                    d="M3 15.2308C3 15.3736 3.05673 15.5105 3.15771 15.6115C3.25869 15.7125 3.39565 15.7692 3.53846 15.7692C3.68127 15.7692 3.81823 15.7125 3.91921 15.6115C4.02019 15.5105 4.07692 15.3736 4.07692 15.2308C4.07692 15.0879 4.02019 14.951 3.91921 14.85C3.81823 14.749 3.68127 14.6923 3.53846 14.6923C3.39565 14.6923 3.25869 14.749 3.15771 14.85C3.05673 14.951 3 15.0879 3 15.2308V15.2308Z"></path>
                <path
                    d="M2.62738 14.3197C2.86902 14.078 3.19674 13.9423 3.53846 13.9423 3.88018 13.9423 4.20791 14.078 4.44954 14.3197 4.69118 14.5613 4.82692 14.889 4.82692 15.2308 4.82692 15.5725 4.69118 15.9002 4.44954 16.1418 4.20791 16.3835 3.88018 16.5192 3.53846 16.5192 3.19674 16.5192 2.86902 16.3835 2.62738 16.1418 2.38575 15.9002 2.25 15.5725 2.25 15.2308 2.25 14.889 2.38575 14.5613 2.62738 14.3197zM3.53846 15.4423C3.59456 15.4423 3.64837 15.42 3.68804 15.3803 3.72771 15.3407 3.75 15.2869 3.75 15.2308 3.75 15.1747 3.72771 15.1208 3.68804 15.0812 3.64837 15.0415 3.59456 15.0192 3.53846 15.0192 3.48236 15.0192 3.42855 15.0415 3.38888 15.0812 3.34921 15.1208 3.32692 15.1747 3.32692 15.2308 3.32692 15.2869 3.34921 15.3407 3.38888 15.3803 3.42855 15.42 3.48236 15.4423 3.53846 15.4423zM6.55769 15.2308C6.55769 14.8166 6.89348 14.4808 7.30769 14.4808H17C17.4142 14.4808 17.75 14.8166 17.75 15.2308 17.75 15.645 17.4142 15.9808 17 15.9808H7.30769C6.89348 15.9808 6.55769 15.645 6.55769 15.2308z"
                    fillRule="evenodd" clipRule="evenodd"></path>
            </g>
        </svg>,
        createNodeFunction: ({editor, selectedBlockType}) => {
            const selection = $getSelection();
            const node = $getExtendedListNode(selection.getNodes()[0]);
            if (node) {
                if (node.getListType() !== "bullet") {
                    node.setListType("bullet");
                }
            } else {
                if (selectedBlockType.key === "bullet") {
                    removeList(editor);
                } else {
                    insertList(editor, "bullet")
                }
            }
        },
        appearOutside: true
    }
];

function getBlockType(node) {
    if (Array.isArray(node)) {
        return getBlockType(node[0]);
    }
    if (!node) {
        return "paragraph";
    }
    if ($isExtendedListNode(node)) {
        return node.getListType();
    }
    if ($isHeadingNode(node)) {
        return node.getTag()
    }
    return getBlockType(node.getParent())
}

export default function BlockPlugin({containerSelector}) {
    const [editor] = useLexicalComposerContext();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedBlockType, setSelectedBlockType] = React.useState(SUPPORTED_BLOCK_TYPES.filter(block => block.key === "paragraph")[0]);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const markedBlockType = getBlockType(selection.getNodes())
                setSelectedBlockType(SUPPORTED_BLOCK_TYPES.filter(block => block.key === markedBlockType)[0]);
            }
        });
    });

    function changeBlock(block) {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                block.createNodeFunction({selection, editor, selectedBlockType});
            }
        });
    }

    return [<ListPlugin key="block-list-plugin"/>,
        <Dialog key="block-dialog" open={isDialogOpen}
                containerSelector={containerSelector}
                position={Dialog.positions.BOTTOM}
                onClickOutside={() => setIsDialogOpen(false)}
                showTrigger={[]}
                hideTrigger={[]}
                content={() => <DialogContentContainer>
                    <List className="toolbar-list">
                        {SUPPORTED_BLOCK_TYPES.map(block => (<ListItem key={block.key}
                                                                       onClick={() => changeBlock(block)}
                                                                       selected={block.key === selectedBlockType.key}>
                                <Flex gap={Flex.gaps.SMALL}>
                                    {block.icon}
                                    <Text type={Text.types.TEXT2} ellipsis={true}>{block.title}</Text>
                                </Flex>
                            </ListItem>
                        ))}
                    </List>
                </DialogContentContainer>}>
            <Button kind={Button.kinds.TERTIARY}
                    size={Button.sizes.SMALL}
                    disabled={!editor.isEditable()}
                    style={{width: "105px"}}
                    onClick={() => setIsDialogOpen(true)}>
                <Text type={Text.types.TEXT2} ellipsis={true}>{selectedBlockType.title}</Text>
            </Button>
        </Dialog>,
        ...SUPPORTED_BLOCK_TYPES.filter(block => block.appearOutside).map((block, index) => {
            return <Button key={index}
                           kind={Button.kinds.TERTIARY}
                           size={Button.sizes.SMALL}
                           disabled={!editor.isEditable()}
                           active={selectedBlockType.key === block.key}
                           onClick={() => changeBlock(block)}>
                {block.icon}
            </Button>
        })
    ];
}