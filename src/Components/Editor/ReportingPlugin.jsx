import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin.js";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin.js";
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin.js";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary.js";
import {ContentEditable} from "@lexical/react/LexicalContentEditable.js";
import {useEffect, useState} from "react";

export default function ReportingPlugin({onRef, onChange}) {
    const [editor] = useLexicalComposerContext();
    const [editorState, setEditorState] = useState();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (editorState) onChange(editorState)
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [editorState]);

    function onChangeAdapter() {
        editor.update(() => {
            setEditorState($generateHtmlFromNodes(editor, null));
        });
    }

    return [<RichTextPlugin key="rich-text"
                            contentEditable={<div ref={onRef} style={{width: "100%", flexGrow: 1, padding: "8px 0"}}>
                                <ContentEditable style={{
                                    width: "100%",
                                    height: "100%",
                                    outline: 0
                                }}/>
                            </div>}
                            ErrorBoundary={LexicalErrorBoundary}/>,
        <OnChangePlugin key="on-change-plugin" onChange={onChangeAdapter}/>,
        <TabIndentationPlugin key="tab-plugin"/>
    ]
}