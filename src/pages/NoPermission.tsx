import { Home } from "@mui/icons-material";
import { Box, Button, CssBaseline, CssVarsProvider, Stack, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";

export default function NoPermission() {
    const nav = useNavigate();

    return (
        <CssVarsProvider defaultMode="dark">
            <CssBaseline />
            <Stack
                sx={(theme) => ({
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
                spacing={4}
            >
                <Typography level="h2">~ 403 Forbidden ~</Typography>
                <Stack
                    alignItems="center"
                    spacing={2}
                >
                    <Typography level="body-md">嘿! 你没有权限这样做! 你不应该知道这个网址的 :(</Typography>
                    <Button size="sm" color="neutral" onClick={() => nav("/")} startDecorator={<Home />}>
                        返回主页
                    </Button>
                </Stack>
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    alignItems: "center"
                }}>
                    <Typography level="body-sm">Powered By BackroomsMC IT Group</Typography>
                </div>
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
    )
}