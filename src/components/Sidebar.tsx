import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';
import { Assessment, Gamepad } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/joy';

export default function Sidebar(props: any) {
  const nav = useNavigate();
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
          }
        })
      })
    }
  })

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={() => ({
          ':root': {
            '--Sidebar-width': '250px'
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm" href='https://backroomsmc.com.cn' sx={{ background: "url(icon.png)", backgroundSize: "cover" }} />
        <Typography level="title-md">BackroomsMC <br /> 统一通行证</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => { nav("/overview") }} selected={props.selected === "仪表盘"}>
              <Assessment />
              <ListItemContent>
                <Typography level="title-sm">仪表盘</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => { nav("/gameProfile") }} selected={props.selected === "游戏角色"}>
              <Gamepad />
              <ListItemContent>
                <Typography level="title-sm">游戏角色</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>

        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => { nav("/about") }} selected={props.selected === "关于我们"}>
              <SupportRoundedIcon />
              关于我们
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => { nav("/setting") }} selected={props.selected === "用户设置"}>
              <SettingsRoundedIcon />
              用户设置
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{user.username}</Typography>
          <Typography level="body-xs">{user.permission}</Typography>
        </Box>
        <IconButton onClick={() => {
          fetch("/api/auth/logout");
          nav("/login");
        }} size="sm" variant="plain" color="neutral">
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}