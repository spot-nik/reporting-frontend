import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useState} from "react";
import {$getSelection, $isRangeSelection} from "lexical";
import {$getSelectionStyleValueForProperty, $patchStyleText} from "@lexical/selection";
import {Dialog, DialogContentContainer, List, ListItem, Button, Text} from "monday-ui-react-core";

const FONT_SIZE_PROPERTY = 'font-size';
const DEFAULT_FONT_SIZE = '12px';

const FONT_SIZE_OPTIONS = ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px',
    '36px', '48px']

export default function FontSizePlugin({containerSelector}) {
    const [editor] = useLexicalComposerContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFontSize, setSelectedFontSize] = useState(DEFAULT_FONT_SIZE);


    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let selectionFontSize = $getSelectionStyleValueForProperty(selection, FONT_SIZE_PROPERTY, DEFAULT_FONT_SIZE);
                if (!selectionFontSize) selectionFontSize = "Mixed";
                if (selectedFontSize !== selectionFontSize) setSelectedFontSize(selectionFontSize);
            }
        });
    });

    function handleClick(option) {
        setIsDialogOpen(false);
        setSelectedFontSize(option);
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {
                    [FONT_SIZE_PROPERTY]: option,
                });
            }
        });
    }


    return <Dialog open={isDialogOpen}
                   containerSelector={containerSelector}
                   position={Dialog.positions.BOTTOM}
                   onClickOutside={() => setIsDialogOpen(false)}
                   showTrigger={[]}
                   hideTrigger={[]}
                   content={() => <DialogContentContainer>
                       <List className="toolbar-list">
                           {FONT_SIZE_OPTIONS.map(fontSize => (<ListItem key={fontSize}
                                                                         onClick={() => handleClick(fontSize)}
                                                                         selected={fontSize === selectedFontSize}>
                               <Text type={Text.types.TEXT2} ellipsis={true}
                                     style={{fontFamily: fontSize}}>{fontSize}</Text>
                           </ListItem>))}
                       </List>
                   </DialogContentContainer>}>
        <Button kind={Button.kinds.TERTIARY}
                size={Button.sizes.SMALL}
                disabled={!editor.isEditable()}
                style={{width: "50px"}}
                onClick={() => setIsDialogOpen(true)}>
            <Text type={Text.types.TEXT2} ellipsis={true}>{selectedFontSize}</Text>
        </Button>
    </Dialog>
}

