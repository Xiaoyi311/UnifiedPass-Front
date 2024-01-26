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
import { useCallback } from 'react';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Check, Microsoft } from '@mui/icons-material';

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
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
  let timer: any;
  let code = "";
  const [miCode, setMiCode] = React.useState("");
  const [miAccess, setMiAccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [miAccessStatus, setMiAccessStatus] = React.useState(0);
  const nav = useNavigate();
  const [token, setToken] = React.useState("");
  const [refreshReCaptcha, setRefreshReCaptcha] = React.useState(false);

  const onVerify = useCallback((token: string) => {
    setToken(token);
  }, [setToken]);

  async function checkCode() {
    const data: any = JSON.parse(await (await fetch("/api/auth/miOauthStatus?code=" + code, {
      method: "GET",
    })).text());

    if (data.status === 403) {
      alert("人机验证失败, 请检查您的网络环境, 或者刷新页面重试!");
    } else if (data.status === 200) {
      switch (data.data) {
        case "VERIFYING":
          return;
        case "CANCEL":
          alert("客户端已拒绝授权!");
          setMiCode("");
          setMiAccessStatus(0);
          break;
        case "ERROR":
          alert("微软服务器返回错误!");
          setMiCode("");
          setMiAccessStatus(0);
          break;
        case "OUTDATED":
          alert("代码已过期! 请重新生成!");
          setMiCode("");
          setMiAccessStatus(0);
          break;
        case "REFUSE":
          alert("请求权限出现错误!");
          setMiCode("");
          setMiAccessStatus(0);
          break;
        case "UNKNOWN":
          alert("未知/过期的代码!");
          setMiCode("");
          setMiAccessStatus(0);
          break;
        default:
          setMiCode("");
          setMiAccessStatus(0);
          setMiAccess(data.data);
          break;
      }
      clearInterval(timer);
    } else {
      alert("服务器返回错误，无法授权!")
      setMiAccessStatus(0);
    }
  }

  async function miAccessF() {
    setMiAccessStatus(1);

    const data: any = JSON.parse(await (await fetch("/api/auth/miOauth", {
      method: "GET",
      headers: {
        "Google_token": token
      },
    })).text());

    if (data.status === 403) {
      alert("人机验证失败, 请检查您的网络环境, 或者刷新页面重试!");
    } else if (data.status === 200) {
      setMiCode(data.data);
      alert("授权请求发起成功，确定后自动开启新页面，你需要按照对应流程完成登录，并将以下代码输入新开启的页面：" + data.data);
      window.open("https://login.live.com/oauth20_remoteconnect.srf", '_blank')
      code = data.data;
      setMiCode(code);
      timer = setInterval(checkCode, 3000, [miCode]);
    } else {
      alert("服务器返回错误，无法授权!")
      setMiAccessStatus(0);
    }

    setRefreshReCaptcha(r => !r);
  }

  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <GoogleReCaptcha action='LoginOrRegister' refreshReCaptcha={refreshReCaptcha} onVerify={onVerify} />
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
                  const data = {
                    username: formElements.username.value,
                    password: formElements.password.value,
                    mi_access: miAccess,
                    persistent: formElements.persistent.checked
                  };
                  setLoading(true);

                  if (miAccess !== "") {
                    fetch("/api/auth/register", {
                      headers: {
                        "Content-Type": "application/json",
                        "Google_token": token
                      },
                      method: "POST",
                      body: JSON.stringify(data)
                    })
                      .then((response) => {
                        if (response.status === 403) {
                          alert("人机验证失败, 请检查您的网络环境, 或者刷新页面重试!");
                        } else if (response.status === 204) {
                          alert("注册成功! 请刷新页面登录!");
                        } else if (response.status !== 200) {
                          alert("返回数据错误!");
                        } else {
                          response.text().then((d) => {
                            const data = JSON.parse(d);
                            if (data.data === "lang:user.exist") {
                              alert("用户名已存在!");
                            } else {
                              alert("用户名或密码不合法，或你未购买 MC 正版!");
                            }
                          })
                        }
                        setRefreshReCaptcha(r => !r);
                        setLoading(false);
                      })
                  } else {
                    fetch("/api/auth/login", {
                      headers: {
                        "Content-Type": "application/json",
                        "Google_token": token
                      },
                      method: "POST",
                      body: JSON.stringify(data)
                    })
                      .then((response) => {
                        response.text().then((d) => {
                          const data = JSON.parse(d);
                          if (data.status === 403) {
                            alert("人机验证失败, 请检查您的网络环境, 或者刷新页面重试!");
                          } else if (data.status !== 200) {
                            alert("返回数据错误!");
                          } else {
                            if (data.data === "OK") {
                              nav("/");
                            } else {
                              alert("用户名或密码错误!");
                            }
                          }
                          setRefreshReCaptcha(r => !r);
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
                  <FormLabel>正版授权</FormLabel>
                  {
                    /*
                    miAccess === "" ?
                      <Button disabled={token === ""} loading={miAccessStatus === 1} onClick={miAccessF} color="success" startDecorator={<Microsoft />}>使用 Microsoft 登录</Button> :
                      <Button color="success" startDecorator={<Check />}>授权成功</Button>
                    */
                  }
                  <Typography level="body-xs">
                    微软登陆正在向 Mojang 申请中，如需注册账号请 QQ 群内 @[技术] Xiaoyi311 处理<br/>
                  </Typography>
                  <FormHelperText>
                    {
                      /*
                      miAccessStatus === 0 ?
                        "由于 Minecraft EULA 的要求，以及避免小号的问题，我们需要验证你的 Minecraft 正版身份" :
                        "您需要在新页面内输入的代码: " + miCode + " 正在等待微软服务器返回授权结果..."
                      */
                    }
                  </FormHelperText>
                </FormControl>
                <Stack gap={2} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Checkbox size="sm" label="记住我" name="persistent" />
                    <Link level="title-sm">
                      忘记你的密码?
                    </Link>
                  </Box>
                  <Box>
                    <Button disabled={token === ""} loading={loading} type="submit" id='submit' fullWidth>
                      登录/注册
                    </Button>
                    <Typography marginTop={1} textAlign="center" level='body-xs'>请注意: 注册时由于会校验MC正版，时间会较长，请耐心等待</Typography>
                  </Box>
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
