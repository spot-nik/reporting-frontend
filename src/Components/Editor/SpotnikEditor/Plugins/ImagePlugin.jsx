import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Upload} from "antd";
import {useState} from "react";
import {$insertNodes} from "lexical";
import {$createImageNode} from "../Nodes/ImageNode.jsx";
import {v4 as uuid} from "uuid";
import {
    Dialog,
    DialogContentContainer,
    IconButton,
    TabsContext,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Flex,
    TextField,
    Icon,
    Tooltip,
    Button
} from "monday-ui-react-core";
import {Image, Info, Upload as UploadIcon} from "monday-ui-react-core/icons";

function UrlTab({setImageInfo}) {
    return <TextField placeholder="Public url"
                      type={TextField.types.URL}
                      onChange={(value) => setImageInfo((prev) => ({...prev, src: value}))}/>
}

function UploadTab({setImageInfo}) {
    async function uploadImage({file}) {
        const fileKey = encodeURIComponent(`${uuid()}-${file.name}`);
        const url = `https://storage.googleapis.com/upload/storage/v1/b/${import.meta.env.VITE_PHOTOS_BUCKET}/o?uploadType=media&name=${fileKey}`;

        const response = await fetch(url, {
            method: "POST",
            body: file,
            headers: {
                "Content-Type": file.type
            }
        });
        if (response.status === 200) {
            return `https://storage.googleapis.com/${import.meta.env.VITE_PHOTOS_BUCKET}/${fileKey}`;
        } else {
            return false;
        }
    }

    async function makeCustomRequest({file, onSuccess}) {
        const res = await uploadImage({file});
        setImageInfo((prev) => ({...prev, src: res}));
        onSuccess();
    }

    return <Upload customRequest={makeCustomRequest}
                   accept={".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"}>
        <Button leftIcon={UploadIcon}
                kind={Button.kinds.SECONDARY}
                size={Button.sizes.SMALL}
                style={{width: "100%"}}>Upload photo</Button>
    </Upload>
}

function LinkDialog({infoImage, setImageInfo}) {
    const [activeTab, setActiveTab] = useState(0);

    return <TabsContext activeTabId={activeTab}>
        <TabList className="insights-tab-list" onTabChange={setActiveTab}>
            <Tab>Upload</Tab>
            <Tab>From the internet</Tab>
        </TabList>
        <TabPanels>
            <TabPanel className="upload-image-tab-panel">
                <UploadTab infoImage={infoImage} setImageInfo={setImageInfo}/>
            </TabPanel>
            <TabPanel>
                <UrlTab infoImage={infoImage} setImageInfo={setImageInfo}/>
            </TabPanel>
        </TabPanels>
    </TabsContext>;
}

export default function ImagePlugin({containerSelector}) {
    const [editor] = useLexicalComposerContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState({});

    function handleCancel() {
        setIsDialogOpen(false);
        setData({});
    }

    function insertImage() {
        editor.update(() => {
            const imageNode = $createImageNode(data)
            $insertNodes([imageNode]);
        });
        handleCancel();
    }

    function isImageReady() {
        if (!data.src) {
            return false;
        }
        return !(data.width <= 0 || data.height <= 0);

    }

    return <Dialog open={isDialogOpen}
                   containerSelector={containerSelector}
                   position={Dialog.positions.BOTTOM}
                   onClickOutside={() => setIsDialogOpen(false)}
                   showTrigger={[]}
                   hideTrigger={[]}
                   content={() => <DialogContentContainer>
                       <Flex direction={Flex.directions.COLUMN}
                             gap={Flex.gaps.SMALL}
                             align={Flex.align.CENTER}
                             style={{width: 250}}>
                           <LinkDialog imageInfo={data} setImageInfo={setData}/>
                           <Flex gap={Flex.gaps.SMALL}>
                               <TextField placeholder="Width"
                                          type={TextField.types.NUMBER}
                                          onChange={(value) => setData((prev) => ({...prev, width: value}))}
                                          validation={{
                                              status: (data.width && data.width <= 0) && "error"
                                          }}/>
                               <TextField placeholder="Height"
                                          type={TextField.types.NUMBER}
                                          onChange={(value) => setData((prev) => ({...prev, height: value}))}
                                          validation={{
                                              status: (data.height && data.height <= 0) && "error"
                                          }}/>
                               <Tooltip
                                   content="We recommend setting only one of the ratio fields to save the image ratio">
                                   <Icon icon={Info}/>
                               </Tooltip>
                           </Flex>
                           <Flex gap={Flex.gaps.SMALL} style={{width: "100%"}}>
                               <Button size={Button.sizes.SMALL}
                                       disabled={!isImageReady()}
                                       onClick={insertImage}
                                       style={{width: "100%"}}>Insert</Button>
                               <Button size={Button.sizes.SMALL}
                                       color={Button.colors.NEGATIVE}
                                       onClick={handleCancel}
                                       style={{width: "100%"}}>Cancel</Button>
                           </Flex>
                       </Flex>
                   </DialogContentContainer>}>
        <IconButton icon={Image}
                    size={IconButton.sizes.SMALL}
                    disabled={!editor.isEditable()}
                    onClick={() => setIsDialogOpen(true)}/>
    </Dialog>;
}