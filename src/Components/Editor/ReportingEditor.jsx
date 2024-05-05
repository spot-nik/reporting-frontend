import SpotnikEditor from "./SpotnikEditor/Editor.jsx";
import ReportingPlugin from "./ReportingPlugin.jsx";
import UndoRedoPlugin from "./SpotnikEditor/Plugins/UndoRedoPlugin.jsx";
import {Divider} from "monday-ui-react-core";
import FontsPlugin from "./SpotnikEditor/Plugins/FontPlugin.jsx";
import FontSizePlugin from "./SpotnikEditor/Plugins/FontSizePlugin.jsx";
import ColorPlugin from "./SpotnikEditor/Plugins/ColorPlugin.jsx";
import StylePlugin from "./SpotnikEditor/Plugins/StylePlugin.jsx";
import DirectionPlugin from "./SpotnikEditor/Plugins/DirectionPlugin.jsx";
import AlignPlugin from "./SpotnikEditor/Plugins/AlignPlugin.jsx";
import BlockPlugin from "./SpotnikEditor/Plugins/BlockPlugin.jsx";
import ImagePlugin from "./SpotnikEditor/Plugins/ImagePlugin.jsx";
import EmojiPlugin from "./SpotnikEditor/Plugins/EmojiPlugin.jsx";
import LinkPlugin from "./SpotnikEditor/Plugins/LinkPlugin.jsx";
import InsightBuilder from "../InsightBuilder/InsightBuilder.jsx";
import {Textcolor, HighlightColorBucket} from "monday-ui-react-core/icons";
import {useState} from "react";

export default function ReportingEditor({initialValue, disabled, onChange, containerSelector}) {
    const [editorElement, setEditorElement] = useState(null);
    const parser = new DOMParser();
    const initialDom = parser.parseFromString(initialValue || "<div></div>", "text/html");

    function onRef(_editorElement) {
        setEditorElement(_editorElement);
    }

    return <SpotnikEditor initialDom={initialDom}
                          containerSelector={containerSelector}
                          disabled={disabled}
                          innerEditor={<ReportingPlugin onRef={onRef} onChange={onChange} toolbarPlugins/>}
                          toolbarPlugins={[
                              <InsightBuilder key="insight-builder" editorElement={editorElement}/>,
                              <Divider key="div1" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <UndoRedoPlugin key="undo-redo"/>,
                              <Divider key="div2" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <FontsPlugin key="fonts"/>,
                              <FontSizePlugin key="font-size"/>,
                              <ColorPlugin key="font-color"
                                           buttonIcon={Textcolor}
                                           defaultColor="#000000"
                                           previewStyleTarget="color"
                                           targetStyle="color"/>,
                              <ColorPlugin key="highlight-color"
                                           buttonIcon={HighlightColorBucket}
                                           previewStyleTarget="background"
                                           targetStyle="background-color"/>,
                              <Divider key="div3" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <StylePlugin key="style"/>,
                              <Divider key="div4" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <DirectionPlugin key="dir"/>,
                              <Divider key="div5" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <AlignPlugin key="align"/>,
                              <Divider key="div6" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <BlockPlugin key="block"/>,
                              <Divider key="div7" className="toolbar-divider" direction={Divider.directions.VERTICAL}/>,
                              <LinkPlugin key="link"/>,
                              <ImagePlugin key="image"/>,
                              <EmojiPlugin key="emoji"/>
                          ]}
    />
}