import {
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter,
    Button,
    Flex,
    MultiStepIndicator,
    IconButton
} from 'monday-ui-react-core';
import {useRef, useState} from "react";
import "./InsightBuilder.css";
import "./VibeBugFix.css";
import {FUNCTIONS} from "./insightsFunctions.jsx";
import Steps from "./Modal/Steps.jsx";
import MainContent from "./Modal/MainContent.jsx";
import Footer from "./Modal/Footer.jsx";
import {$createRangeSelection, $getSelection, $insertNodes} from "lexical";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createInsightNode, $isInsightNode} from "./InsightNode.jsx";
import {NavigationChevronLeft, NavigationChevronRight, Check, CloseSmall} from "monday-ui-react-core/icons";
import Lottie from "lottie-react";
import InsightAnimation from "./InsightAnimation.json";
import FloatingInsightEditorPlugin from "./FloatingInsightEditor.jsx";

export default function InsightBuilder({editorElement}) {
    const [editor] = useLexicalComposerContext();
    const [insightData, setInsightData] = useState({filters: []});
    const [insightNode, setInsightNode] = useState(null);
    const [isFilterDone, setIsFilterDone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);
    const animationRef = useRef(null);

    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    const steps = [
        {
            key: "function",
            titleText: "Function",
            status: functionStepStatus()
        },
        {
            key: "configuration",
            titleText: "Configuration",
            status: configurationStepStatus(),
        },
        {
            key: "filter",
            titleText: "Filter",
            status: filterStepStatus(),
            onNext: () => setIsFilterDone(true),
            nextText: (insightData.filters?.length > 0 || insightData.breakdown) ? "Next" : "Skip",
            isNextDisabled: !verifyFilters(),
            nextIcon: NavigationChevronRight
        },
        {
            key: "preview",
            titleText: "Preview",
            status: previewStepStatus(),
            onBack: functionHasFilterStep() ? () => setIsFilterDone(false) : null,
            backIcon: NavigationChevronLeft,
            onNext: insertInsight,
            nextText: "Confirm",
            nextColor: Button.colors.POSITIVE,
            nextIcon: Check
        }
    ].filter((step) => step.key !== "filter" || (step.key === "filter" && functionHasFilterStep()))

    function currentStep() {
        return steps.find((step) => step.status === MultiStepIndicator.stepStatuses.ACTIVE);
    }

    function functionStepStatus() {
        if (insightData.function) {
            return MultiStepIndicator.stepStatuses.FULFILLED;
        }
        return MultiStepIndicator.stepStatuses.ACTIVE;
    }

    function configurationStepStatus() {
        if (chosenFunction) {
            if (chosenFunction.configurationFields.every((field) => insightData[field] !== undefined)) {
                return MultiStepIndicator.stepStatuses.FULFILLED;
            }
            return MultiStepIndicator.stepStatuses.ACTIVE;
        }
        return MultiStepIndicator.stepStatuses.PENDING;
    }

    function functionHasFilterStep() {
        return chosenFunction?.supportsFilter || chosenFunction?.supportsBreakdown;
    }

    function filterStepStatus() {
        if (configurationStepStatus() === MultiStepIndicator.stepStatuses.FULFILLED) {
            if (functionHasFilterStep()) {
                if (isFilterDone) {
                    return MultiStepIndicator.stepStatuses.FULFILLED;
                }
                return MultiStepIndicator.stepStatuses.ACTIVE;
            }
            return MultiStepIndicator.stepStatuses.FULFILLED
        }
        return MultiStepIndicator.stepStatuses.PENDING;
    }

    function previewStepStatus() {
        if (filterStepStatus() === MultiStepIndicator.stepStatuses.FULFILLED) {
            return MultiStepIndicator.stepStatuses.ACTIVE;
        }
        return MultiStepIndicator.stepStatuses.PENDING;
    }

    function verifyFilters() {
        if (insightData.filters.length === 0) {
            return true;
        }
        return insightData.filters.every((filter) => filter.column && filter.condition && filter.value);
    }

    function resetInsight() {
        setInsightData({filters: []});
        setInsightNode(null);
        setIsFilterDone(false);
    }

    function setInsight(key, value) {
        if (key === "function") {
            resetInsight();
        }
        setInsightData({...insightData, [key]: value});
    }

    function closeModal() {
        setIsOpen(false);
        resetInsight();
    }

    function getSentence() {
        const func = FUNCTIONS.find(f => f.value === insightData.function?.value);
        if (func) {
            const sentenceParts = [];
            func.parts.forEach(part => {
                if (part.type === "text") {
                    sentenceParts.push(part.text);
                } else if (part.type === "column") {
                    sentenceParts.push(insightData.column?.label);
                } else if (part.type === "value") {
                    sentenceParts.push(insightData.value?.label);
                } else if (part.type === "timespan") {
                    sentenceParts.push(insightData.timespan?.label);
                }
            });
            insightData.filters?.forEach((filter, index) => {
                sentenceParts.push(index === 0 ? "where" : "and");
                sentenceParts.push(filter.column?.label);
                sentenceParts.push(filter.condition?.label);
                sentenceParts.push(filter.value?.label);
            })
            insightData.breakdown && sentenceParts.push("and break it down by", insightData.breakdown.label);
            return sentenceParts.join(" ");
        }
    }

    function insertInsight() {
        editor.update(() => {
            if (insightNode) {
                insightNode.setInsightData(insightData);
            } else {
                let selection;
                selection = $getSelection();
                if (selection === null) {
                    selection = $createRangeSelection();
                }
                const newInsightNode = $createInsightNode({
                    title: `{${getSentence()}}`,
                    func: insightData.function.value,
                    column: insightData.column,
                    value: insightData.value,
                    timespan: insightData.timespan,
                    filters: insightData.filters,
                    breakdown: insightData.breakdown
                });

                if (selection.getNodes().length === 1 && $isInsightNode(selection.getNodes()[0])) {
                    selection.getNodes()[0].insertAfter(newInsightNode);
                } else {
                    $insertNodes([newInsightNode]);
                }
            }
        })
        closeModal();
    }

    return [<div key="button"
                 onMouseEnter={() => animationRef.current.play()}
                 onMouseLeave={() => animationRef.current.stop()}>
        <Button id="add-insight-button"
                ref={buttonRef}
                size={Button.sizes.SMALL}
                onClick={() => {
                    resetInsight();
                    if (editor.isEditable()) setIsOpen(true);
                }}>
            <Flex gap={Flex.gaps.XS}>
                <Lottie lottieRef={animationRef}
                        animationData={InsightAnimation}
                        loop={false}
                        autoplay={false}
                        style={{width: "25px", height: "25px"}}/>
                <span>Create Insight</span>
            </Flex>
        </Button>
    </div>,
        editorElement && <FloatingInsightEditorPlugin key="floating-insight-editor"
                                                      resetInsight={resetInsight}
                                                      openModal={() => setIsOpen(true)}
                                                      setInsightData={setInsightData}
                                                      getSentence={getSentence}
                                                      insightNode={insightNode}
                                                      setInsightNode={setInsightNode}
                                                      editorElement={editorElement}/>,
        <Modal key="modal" id="add-insight-modal"
               classNames={{container: "insight-modal-container", modal: 'insight-modal'}}
               onClose={closeModal}
               show={isOpen}
               triggerElement={buttonRef.current}>
            <ModalHeader className="insight-modal-header" title="" titleClassName="insight-modal-header-title">
                <Steps steps={steps}/>
                <IconButton className="close-modal-button" size={IconButton.sizes.SMALL} icon={CloseSmall}
                            onClick={closeModal}/>
            </ModalHeader>
            <ModalContent className="insight-modal-content">
                <MainContent insightData={insightData} setInsight={setInsight} currentStep={currentStep()}/>
            </ModalContent>
            <ModalFooter className="insight-modal-footer">
                <Footer step={currentStep()} resetInsight={resetInsight}/>
            </ModalFooter>
        </Modal>
    ]
}