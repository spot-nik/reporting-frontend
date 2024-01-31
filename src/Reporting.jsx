import './Reporting.css'
import mondaySdk from "monday-sdk-js";
import {useEffect, useState} from "react";
import {STORAGE_MONDAY_CONTEXT_KEY, STORAGE_SUBSCRIPTION_KEY} from "./consts.js";
import Loader from "./Components/Loader/Loader.jsx";
import ResultPage from "./Components/ResultPage.jsx";
import {getMe} from "./Queries/monday.js";
import {authorize, createUser, getSubscription, installApp, updateUserInformation} from "./Queries/management.js";
import {Button, Space, Typography, Tooltip} from "antd";
import {DashboardOutlined} from "@ant-design/icons";

const monday = mondaySdk();
monday.setApiVersion(import.meta.env.VITE_MONDAY_API_VERSION);

function Reporting() {
    const [initialized, setInitialized] = useState(0); // 0 = Not initialized, 1 = Initializing, 2 = Initialized, 3 = Error
    const [result, setResult] = useState();
    const [context, setContext] = useState({});
    const subscription = JSON.parse(sessionStorage.getItem(STORAGE_SUBSCRIPTION_KEY));

    useEffect(() => {
        if (import.meta.env.VITE_BOARD_ID && import.meta.env.VITE_VIEW_ID) {
            const localContext = {
                account: {id: parseInt(import.meta.env.VITE_ACCOUNT_ID)},
                user: {id: parseInt(import.meta.env.VITE_USER_ID)},
                boardId: parseInt(import.meta.env.VITE_BOARD_ID),
                boardViewId: parseInt(import.meta.env.VITE_VIEW_ID),
            };
            setContext(localContext);
            sessionStorage.setItem(STORAGE_MONDAY_CONTEXT_KEY, JSON.stringify(localContext));
        } else {
            monday.listen("context", (context) => {
                setContext(context.data);
                sessionStorage.setItem(STORAGE_MONDAY_CONTEXT_KEY, JSON.stringify(context.data));
            });
        }
    }, []);

    async function checkAuthorization(user) {
        try {
            await authorize();
            return true;
        } catch (error) {
            console.log(error.error_code);
            if (error.error_code === "USER_NOT_FOUND") {
                await createUser(user);
                await installApp({
                    accountId: user.account.id,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email
                });
                return true;
            }
            if (error.error_code === "APP_NOT_FOUND_IN_USER") {
                await installApp({
                    accountId: user.account.id,
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email
                });
                return true;
            }
            setResult({
                status: "error",
                title: "Unauthorized"
            });
            return false;
        }
    }

    async function initializeUserInformation(user) {
        try {
            await updateUserInformation(user);
            return true;
        } catch (error) {
            setResult({
                status: "error",
                title: "Couldn't update user information"
            });
            return false;
        }
    }

    async function setSubscription() {
        try {
            const fetchedSubscription = await getSubscription();
            sessionStorage.setItem(STORAGE_SUBSCRIPTION_KEY, JSON.stringify(fetchedSubscription));
            return true;
        } catch (error) {
            setResult({
                status: "error",
                title: "Couldn't load subscription"
            })
            return false;
        }
    }

    async function handleInitialization() {
        let user;
        try {
            user = await getMe();
        } catch (err) {
            setResult({
                status: "error",
                title: "Couldn't load user information"
            });
            throw err;
        }

        await checkAuthorization(user);

        const res = await Promise.all([
            initializeUserInformation(user),
            setSubscription()
        ]);
        return res.every(result => result);
    }

    useEffect(() => {
        if (initialized === 0 && context) {
            setInitialized(1);
            handleInitialization()
                .then((res) => {
                    if (res) {
                        setInitialized(2);
                    } else {
                        setInitialized(3);
                    }
                })
                .catch(() => {
                    setInitialized(3);
                });
        }
    }, [context]);

    function isLoading() {
        return [0, 1].includes(initialized);
    }

    if (result) {
        return <ResultPage title={result.title}
                           message={result.message}
                           status={result.status}
                           extra={result.extra}/>
    }

    if (initialized === 3) {
        return <ResultPage status="error" title="Failed to load Insights"/>
    }

    if (isLoading()) {
        return <Loader/>;
    }

    return (
        <div>
            {subscription.is_default &&
                <div style={{
                    textAlign: "center",
                    lineHeight: "40px",
                    backgroundColor: "#333",
                    color: "white",
                    fontSize: "18px"
                }}>
                    <Space>
                        <span>Your account is currently on the {subscription.name} plan</span>
                        <Button shape="round"
                                icon={<DashboardOutlined/>}
                                onClick={() => {
                                    monday.execute('openPlanSelection');
                                }}>Change plan</Button>
                    </Space>
                </div>}
            <h1>Hello world {context?.user?.id}</h1>
            <div style={{
                position: "fixed",
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.5)",
                padding: "0 5px",
                lineHeight: "40px",
                fontSize: "22px",
                fontWeight: "bold",
            }}>
                <Typography.Link
                    style={{fontSize: "22px"}}
                    onClick={() => monday.execute("openLinkInTab", {url: "https://www.superform.spot-nik.com/form/62193345c8a91eda41fb1190"})}>
                    Feedback
                </Typography.Link>
                <span> - </span>
                <Tooltip placement="top"
                         title="rnd@spot-nik.com">
                    <Typography.Link
                        style={{fontSize: "22px"}}
                        onClick={() => monday.execute("openLinkInTab", {url: "mailto:rnd@spot-nik.com"})}>
                        Support
                    </Typography.Link>
                </Tooltip>
                <span> - </span>
                <Typography.Link
                    style={{fontSize: "22px"}}
                    onClick={() => monday.execute("openLinkInTab", {url: "https://www.spot-nik.com/superform#comp-ky80d4dy"})}>
                    FAQ
                </Typography.Link>
            </div>
        </div>
    );
}

export default Reporting;