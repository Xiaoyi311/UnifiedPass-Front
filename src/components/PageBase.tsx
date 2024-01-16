import { CssVarsProvider, CssBaseline, Box, Typography, Breadcrumbs, Skeleton } from "@mui/joy";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Home, NavigateNext } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import NoPermission from "../pages/NoPermission";

export default function PageBase(props: any) {
  const nav = useNavigate();

  const [allow, setAllow] = useState(true);
  const [user, setUser] = useState<{
    username: any,
    permission: any
  }>({
    username: <Skeleton>I don't know</Skeleton>,
    permission: <Skeleton>A Player?</Skeleton>
  })

  useEffect(() => {
    if (typeof (user.username) == "object") {
      fetch("/api/auth/info").then((data) => {
        data.text().then((text) => {
          const json = JSON.parse(text);
          if (json.status === 200) {
            setUser({
              username: json.data.username,
              permission: json.data.admin ? "超级管理员" : "普通玩家"
            })

            if (props.admin && !json.data.admin) {
              setAllow(false)
            }
          }
        })
      })
    }
  })

  return (
    allow ?
      <CssVarsProvider defaultMode="dark">
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          <Header />
          <Sidebar selected={props.selected} />
          <Box
            component="main"
            className="MainContent"
            overflow="auto"
            sx={(theme) => ({
              height: '100vh',
              width: '100vw',
              zIndex: 1,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255 255 255 / 0.4)',
              [theme.getColorSchemeSelector('dark')]: {
                backgroundColor: 'rgba(19 19 24 / 0.4)',
              },
              px: { xs: 2, md: 6 },
              pt: {
                xs: 'calc(12px + var(--Header-height))',
                sm: 'calc(12px + var(--Header-height))',
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              gap: 1,
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Breadcrumbs
                size="sm"
                aria-label="breadcrumbs"
                separator={<NavigateNext fontSize="small" />}
                sx={{ pl: 0 }}
              >
                <Home />
                <Typography color="neutral" fontWeight={500} fontSize={12}>
                  统一通行证
                </Typography>
                <Typography color="primary" fontWeight={500} fontSize={12}>
                  {props.selected}
                </Typography>
              </Breadcrumbs>
            </Box>
            <Box
              sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: "20px"
              }}
            >
              <Typography level="h2" component="h1">
                {props.selected}
              </Typography>
            </Box>
            {props.children}
          </Box>
        </Box>
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
      : <NoPermission />
  )
}