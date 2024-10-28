import {useEffect, useState} from "react";
import {$getSelection, $isRangeSelection} from "lexical";
import {$getSelectionStyleValueForProperty, $patchStyleText} from "@lexical/selection";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Flex, Dialog, DialogContentContainer, Search, List, ListItem, Button, Text} from "monday-ui-react-core";

const DEFAULT_FONT = "Arial";
const FONT_PROPERTY = 'font-family';

const SUPPORTED_FONTS = ['Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Avant Garde', 'Impact', 'Zapf Chancery', 'Apple Chancery', 'Optima', 'Hoefler Text', 'Florence', 'Brush Script', 'Sitka', 'Skia', 'Symbol', 'Webdings', 'Wingdings', 'Andale Mono', 'Consolas', 'Monaco', 'Lucida Console', 'Lucida Sans Unicode', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', 'FreeMono', 'Cutive Mono', 'Anonymous Pro', 'Inconsolata', 'Source Code Pro', 'Roboto', 'Open Sans', 'Lato', 'Oswald', 'PT Sans', 'PT Serif', 'Poppins', 'Raleway', 'Roboto Condensed', 'Ubuntu'];

export default function FontsPlugin({containerSelector}) {
    const [editor] = useLexicalComposerContext()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredFonts, setFilteredFonts] = useState(SUPPORTED_FONTS);
    const [selectedFont, setSelectedFont] = useState(DEFAULT_FONT);

    useEffect(() => {
        setFilteredFonts(SUPPORTED_FONTS.filter(font => font.toLowerCase().includes(search.toLowerCase())));
    }, [search]);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let markedColor = $getSelectionStyleValueForProperty(selection, FONT_PROPERTY, DEFAULT_FONT)
                if (!markedColor) markedColor = "Mixed";
                if (selectedFont !== markedColor) setSelectedFont(markedColor)
            }
        });
    });

    function handleClick(font) {
        setIsDialogOpen(false);
        setSelectedFont(font);
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {[FONT_PROPERTY]: font});
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
                       <Flex gap={Flex.gaps.XS} direction={Flex.directions.COLUMN}>
                           <Search size={Search.sizes.SMALL}
                                   placeholder="Search"
                                   debounceRate={100}
                                   value={search}
                                   onChange={setSearch}/>
                           <List className="toolbar-list" style={{width: 200}}>
                               {filteredFonts.map(font => (<ListItem key={font}
                                                                     onClick={() => handleClick(font)}
                                                                     selected={font === selectedFont}>
                                   <Text type={Text.types.TEXT2} ellipsis={true}
                                         style={{fontFamily: font}}>{font}</Text>
                               </ListItem>))}
                           </List>
                       </Flex>
                   </DialogContentContainer>}>
        <Button kind={Button.kinds.TERTIARY}
                size={Button.sizes.SMALL}
                disabled={!editor.isEditable()}
                style={{width: "80px"}}
                onClick={() => setIsDialogOpen(true)}>
            <Text type={Text.types.TEXT2} ellipsis={true} style={{fontFamily: selectedFont}}>{selectedFont}</Text>
        </Button>
    </Dialog>
}