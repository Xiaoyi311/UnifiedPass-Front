import { Check, Close } from "@mui/icons-material";
import { Box, Button, CircularProgress, CssBaseline, CssVarsProvider, Divider, Stack, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from "react-cookies";

export default function OAuthReq() {
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const [first, setFirst] = useState<boolean>(true);
    const [info, setInfo] = useState<any>({
        status: 0
    });

    useEffect(() => {
        if (!first) return;
        setFirst(false);
        fetch("/api/auth/info", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        })
            .then((response) => {
                response.text().then((d) => {
                    const data = JSON.parse(d);
                    if (data.status === 403) {
                        if (window.location.href.split("/#/oauthReq")[1] !== undefined) {
                            nav("/login?cb=oauthReq" + encodeURIComponent(window.location.href.split("/#/oauthReq")[1]))
                        }
                    } else if (data.status !== 200) {
                        alert("返回数据错误!");
                    } else {
                        fetch("/api/oauth/info/" + searchParams.get("client_id"), {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method: "GET"
                        }).then((r) => r.text().then((info) => {
                            const data2 = JSON.parse(info).data;
                            if (data2 === "lang:oauth.empty" || data2.status === 404) {
                                setInfo({
                                    status: -1,
                                    data: "授权错误！请求的应用程序不存在！请联系开发者！"
                                });
                            } else {
                                if (searchParams.get("redirect_uri")?.startsWith(data2.callback)) {
                                    setInfo({
                                        status: 1,
                                        data: data2
                                    });
                                } else {
                                    setInfo({
                                        status: -1,
                                        data: "授权错误！重定向的链接不安全！请联系开发者！"
                                    });
                                }
                            }
                        }))
                    }
                })
            })
    });

    function getScope(scope: string): string {
        switch (scope) {
            case "auth.info":
                return "获取您的通行证用户基本信息";
            default:
                return "未知权限: " + scope;
        }
    }

    function accept() {
        fetch("/api/oauth/accept" + window.location.href.split("/#/oauthReq")[1], {
            headers: {
                "X-Csrf-Token": cookie.load("Csrf-Token")
            },
            method: "GET"
        }).then(r => r.text().then(d => {
            if (r.status === 403) {
                alert("授权失败! 权限拒绝!");
            } else {
                setInfo({
                    status: 2,
                    data: JSON.parse(d).data
                })
                setTimeout(() => window.location.href = JSON.parse(d).data, 10000);
            }
        }))
    }

    return (
        <CssVarsProvider defaultMode="dark">
            <CssBaseline />
            <Stack>
                {
                    info.status === 0 ?
                        <Stack sx={(theme) => ({
                            width:
                                'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                            transition: 'width var(--Transition-duration)',
                            transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex',
                            backdropFilter: 'blur(12px)',
                            backgroundColor: 'rgba(255 255 255 / 0.2)',
                            [theme.getColorSchemeSelector('dark')]: {
                                backgroundColor: 'rgba(19 19 24 / 0.4)',
                            },

                        })}
                            height="100vh"
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={4}>
                            <CircularProgress size="lg" />
                            <Typography marginTop={3} level="body-md">正在处理 OAuth 授权请求...</Typography>
                            <div style={{
                                position: "absolute",
                                bottom: "10px",
                                alignItems: "center"
                            }}>
                                <Typography level="body-sm">Powered By BackroomsMC IT Group</Typography>
                            </div>
                        </Stack> :
                        info.status === -1 ?
                            <Stack sx={(theme) => ({
                                width:
                                    'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                                transition: 'width var(--Transition-duration)',
                                transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                                position: 'relative',
                                zIndex: 1,
                                display: 'flex',
                                backdropFilter: 'blur(12px)',
                                backgroundColor: 'rgba(255 255 255 / 0.2)',
                                [theme.getColorSchemeSelector('dark')]: {
                                    backgroundColor: 'rgba(19 19 24 / 0.4)',
                                },

                            })}
                                height="100vh"
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={4}>
                                <Typography level="h1">= OAuth 授权请求 =</Typography>
                                <Typography level="body-lg" color="danger">{info.data}</Typography>
                            </Stack>
                            :
                            info.status === 2 ?
                                <Stack sx={(theme) => ({
                                    width:
                                        'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                                    transition: 'width var(--Transition-duration)',
                                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'flex',
                                    backdropFilter: 'blur(12px)',
                                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                                    [theme.getColorSchemeSelector('dark')]: {
                                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                                    },

                                })}
                                    height="100vh"
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={4}>
                                    <Typography level="h1">= OAuth 授权请求 =</Typography>
                                    <Typography level="body-lg" color="success">授权成功！您将在 10 秒后被重定向至应用程序...</Typography>
                                    <Typography level="body-md">如果长期没有响应，请点击<a href={info.data}>此处</a>手动重定向</Typography>
                                </Stack>
                                :
                                <Stack sx={(theme) => ({
                                    width:
                                        'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                                    transition: 'width var(--Transition-duration)',
                                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'flex',
                                    backdropFilter: 'blur(12px)',
                                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                                    [theme.getColorSchemeSelector('dark')]: {
                                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                                    },

                                })}
                                    height="100vh"
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={4}>
                                    <Typography level="h1">= OAuth 授权请求 =</Typography>
                                    <Typography level="body-lg"><b>{info.data.name}</b> 正请求连接到您的 <b>BackroomsMC 通行证</b> 用户</Typography>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Stack
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Typography level="body-md"><b>申请程序</b>: {info.data.name}</Typography>
                                            <Typography level="body-md"><b>程序简介</b>: {info.data.des === "" ? "无" : info.data.des}</Typography>
                                            <Typography level="body-md"><b>程序主页</b>: {info.data.website === "" ? "无" : info.data.website}</Typography>
                                        </Stack>
                                        <Divider orientation="vertical" />
                                        <Stack
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Typography level="body-md">
                                                申请权限:
                                                <ul>
                                                    {
                                                        searchParams.get("scope")?.split(" ").map((scope) => {
                                                            return <li>{getScope(scope)}</li>
                                                        })
                                                    }
                                                </ul>
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack flexDirection="row">
                                        <Button color="success" startDecorator={<Check />} sx={{ marginRight: "50px" }} onClick={accept}>同意授权</Button>
                                        <Button color="danger" startDecorator={<Close />} onClick={() => setInfo({
                                            status: -1,
                                            data: "授权失败！请求已被用户拒绝，您现在已可以关闭此页面!"
                                        })}>拒绝授权</Button>
                                    </Stack>
                                    <Typography level="body-sm">您将会被重定向到: {searchParams.get("redirect_uri")} 请注意信息安全！</Typography>
                                    <div style={{
                                        position: "absolute",
                                        bottom: "10px",
                                        alignItems: "center"
                                    }}>
                                        <Typography level="body-sm">Powered By BackroomsMC IT Group</Typography>
                                    </div>
                                </Stack>
                }
            </Stack>
            <Box
                sx={(theme) => ({
                    height: '100vh',
                    width: '100vw',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage:
                            'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
                    },
                })}
            />
        </CssVarsProvider>
    );
}