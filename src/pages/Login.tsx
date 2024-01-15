import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useNavigate } from 'react-router-dom';
import { FormHelperText } from '@mui/joy';

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  code: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="neutral" disabled />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      aria-label="toggle light/dark mode"
      {...other}
      onClick={(event) => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
        onClick?.(event);
      }}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const nav = useNavigate();

  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Collapsed-breakpoint': '769px',
            '--Cover-width': '50vw',
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width:
              'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
            maxWidth: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: 'flex',
              alignItems: 'left',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton href='https://backroomsmc.com.cn' sx={{ background: "url(icon.png)", backgroundSize: "cover" }} variant="soft" color="primary" size="sm" />
              <Typography level="title-lg">BackroomsMC 统一通行证</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography level="h3">登录/注册</Typography>
                <Typography level="body-sm">
                  欢迎来到 BackroomsMC 请在下方登录/注册统一通行证
                </Typography>
              </Stack>
            </Stack>
            <Divider
              sx={(theme) => ({
                [theme.getColorSchemeSelector('light')]: {
                  color: { xs: '#FFF', md: 'text.tertiary' },
                  '--Divider-lineColor': {
                    xs: '#FFF',
                    md: 'var(--joy-palette-divider)',
                  },
                },
              })}
            />
            <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={(event: React.FormEvent<SignInFormElement>) => {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  let code: number = Number.parseInt(formElements.code.value);
                  const data = {
                    username: formElements.username.value,
                    password: formElements.password.value,
                    code: code,
                    persistent: formElements.persistent.checked,
                  };
                  setLoading(true);
                  if (!Number.isNaN(code)) {
                    fetch("/api/auth/register", {
                      headers: {
                        "Content-Type": "application/json"
                      },
                      method: "POST",
                      body: JSON.stringify(data)
                    })
                      .then((response) => {
                        if (response.status === 204) {
                          alert("注册成功! 请刷新页面登录!");
                        } else if (response.status !== 200) {
                          alert("返回数据错误!");
                        } else {
                          response.text().then((d) => {
                            const data = JSON.parse(d);
                            if (data.data === "lang:user.exist") {
                              alert("用户名已存在!");
                            } else {
                              alert("用户名或密码不合法，或授权码无效!");
                            }
                          })
                        }
                        setLoading(false);
                      })
                  } else {
                    fetch("/api/auth/login", {
                      headers: {
                        "Content-Type": "application/json"
                      },
                      method: "POST",
                      body: JSON.stringify(data)
                    })
                      .then((response) => {
                        response.text().then((d) => {
                          const data = JSON.parse(d);
                          if (data.status !== 200) {
                            alert("返回数据错误!");
                          } else {
                            if (data.data === "OK") {
                              nav("/");
                            } else {
                              alert("用户名或密码错误!");
                            }
                          }
                          setLoading(false);
                        })
                      })
                  }
                }}
              >
                <FormControl required>
                  <FormLabel>用户名</FormLabel>
                  <Input type="username" name="username" />
                </FormControl>
                <FormControl required>
                  <FormLabel>密码</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <FormControl>
                  <FormLabel>授权码</FormLabel>
                  <Input placeholder='留空为登录账号' type="number" name="code" />
                  <FormHelperText>使用正版 MC 加入 auth.backroom.com.cn 服务器获取授权码</FormHelperText>
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox size="sm" label="记住我" name="persistent" />
                    <Link level="title-sm" href="#replace-with-a-link">
                      忘记你的密码?
                    </Link>
                  </Box>
                  <Button loading={loading} type="submit" id='submit' fullWidth>
                    登录
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              Copyright © BackroomsMC IT Group {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
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
