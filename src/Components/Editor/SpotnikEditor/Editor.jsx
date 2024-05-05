import "./Editor.css";
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import ToolbarPlugin from "./Plugins/Toolbar/ToolbarPlugin.jsx";
import {$generateNodesFromDOM} from "@lexical/html";
import {$getRoot, ParagraphNode, TextNode} from "lexical";
import {ExtendedTextNode} from "./Nodes/ExtendedTextNode.jsx";
import {lexicalTheme} from "./LexicalTheme";
import {HeadingNode} from "@lexical/rich-text";
import {ListItemNode, ListNode} from "@lexical/list";
import {LinkNode} from "@lexical/link";
import {ImageNode} from "./Nodes/ImageNode.jsx";
import {ExtendedListItemNode} from "./Nodes/ExtendedListItemNode.jsx";
import {ExtendedListNode} from "./Nodes/ExtendedListNode.jsx";
import {InsightNode} from "../../InsightBuilder/InsightNode.jsx";
import {Flex} from "monday-ui-react-core";


export default function SpotnikEditor({initialDom, innerEditor, toolbarPlugins, disabled, containerSelector}) {
    const initialConfig = {
        namespace: "reporting-editor",
        editable: !disabled,
        editorState: (editor) => {
            if (initialDom) {
                const nodes = $generateNodesFromDOM(editor, initialDom);
                $getRoot().append(...nodes);
            }
        },
        onError: (error) => {
            console.error(error);
        },
        theme: lexicalTheme,
        nodes: [
            ParagraphNode,
            ExtendedTextNode,
            {replace: TextNode, with: (node) => new ExtendedTextNode(node.__text)},
            HeadingNode,
            ExtendedListNode,
            {replace: ListNode, with: (node) => new ExtendedListNode(node.getListType(), node.getStart())},
            ExtendedListItemNode,
            {replace: ListItemNode, with: (node) => new ExtendedListItemNode(node.getValue(), node.getChecked())},
            LinkNode,
            ImageNode,
            InsightNode
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START} style={{width: "100%"}}
                  id="editor-container">
                {toolbarPlugins?.length > 0 && <ToolbarPlugin toolbarPlugins={toolbarPlugins} containerSelector={containerSelector}/>}
                {innerEditor}
            </Flex>
        </LexicalComposer>
    );
}