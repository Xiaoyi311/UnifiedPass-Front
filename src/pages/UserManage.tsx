import { Button, Option, Card, CardActions, CardContent, DialogTitle, Divider, FormControl, FormHelperText, FormLabel, Grid, Input, Modal, ModalClose, ModalDialog, Radio, RadioGroup, Select, Stack, Typography, styled, LinearProgress } from "@mui/joy";
import PageBase from "../components/PageBase";
import { AccountBox, Add, BadgeOutlined, Build, Edit, Flag, Key, Message, PermIdentity, UploadFile } from "@mui/icons-material";
import { useState } from "react";

export default function UserManage() {
    const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;
    const [uvs, setUvs] = useState(false);
    const [player, setPlayer] = useState(false);
    const [selCape, setSelCape] = useState(0);
    const [profile, setProfile] = useState({
        username: "",
        uuid: "",
        model: "",
        skin: "",
        cape: [] as any[],
        skin_src: new File([], "un")
    });
    const [user, setUser] = useState({
        uuid: "",
        username: "",
        password: "",
        admin: false,
        mojang: "",
        registerTime: 0
    });

    async function newUvsCode(e: any) {
        e.preventDefault();
        const uuid: string = e.currentTarget.elements.uuid.value;

        if (uuid.length !== 32) {
            alert("格式不正确!");
            return;
        }

        const r = await fetch("/api/auth/createUvs", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                uuid: uuid
            })
        })

        const code = Number.parseInt(JSON.parse(await r.text()).data)
        if (Number.isNaN(code)) {
            alert("创建 UVS 验证码失败! 请检查正版 UUID 是否已被使用!");
        } else {
            alert("创建成功! 验证码: " + code);
        }

        setUvs(false);
    }

    async function getPlayer(e: any) {
        e.preventDefault();
        const uuid: string = e.currentTarget.elements.uuid.value;

        if (uuid.length !== 32) {
            alert("格式不正确!");
            return;
        }

        const r = await fetch("/api/yggdrasil/sessionserver/session/minecraft/profile/" + uuid, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        });

        if (r.status === 204) {
            alert("用户不存在!");
            return;
        }

        const data = JSON.parse(await r.text());
        const texture = JSON.parse(atob(data.properties[0].value))

        const r1 = await fetch("/api/profile/getUserCapes/" + uuid, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        });
        const capeData = JSON.parse(await r1.text());

        const r2 = await fetch("/api/auth/info/profile/" + uuid, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        });
        const userData = JSON.parse(await r2.text()).data;

        alert("查询成功!");

        setProfile({
            username: data.name,
            uuid: data.id,
            model: texture.textures.SKIN === undefined ? "default" : texture.textures.SKIN.metadata.model,
            skin: texture.textures.SKIN === undefined ? "" : texture.textures.SKIN.url,
            cape: capeData.data,
            skin_src: profile.skin_src
        });
        setUser({
            uuid: userData.id,
            username: userData.username,
            password: "",
            admin: userData.admin,
            mojang: userData.mojang,
            registerTime: userData.registerTime
        });
        setPlayer(false);
    }

    function skinChange(e1: any) {
        const file = e1.target.files[0];
        const fileName = e1.target.value.substring(e1.target.value.indexOf("."));
        if (fileName !== ".png") {
            alert("仅支持 png 文件!");
            e1.target.value = "";
            return;
        }
        // 检查宽高是否为64x32的整数倍或64x64的整数倍
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (file.size > 5 * 1024 * 1024) {
                    alert('文件大小超过5MB');
                    e1.target.value = "";
                    return;
                }

                const width = img.width;
                const height = img.height;
                if ((width % 64 !== 0 || height % 64 !== 0) || (width % 32 !== 0 || height % 32 !== 0)) {
                    alert('图片不合法');
                    e1.target.value = "";
                    return;
                }

                setProfile({
                    username: profile.username,
                    uuid: profile.uuid,
                    model: profile.model,
                    skin: typeof (reader.result) == "string" ? reader.result : "",
                    skin_src: file,
                    cape: profile.cape
                })
            }
            img.src = typeof (e.target?.result) == "string" ? e.target?.result : "";
        }
    }

    async function updateProfie(e: any) {
        e.preventDefault();

        if (profile.skin_src.name !== "un") {
            const fileData = new FormData();
            fileData.append("file", profile.skin_src, profile.skin_src.name);
            const r1 = await fetch("/api/profile/uploadSkin/" + profile.uuid, {
                body: fileData,
                method: "POST"
            });

            if (r1.status !== 204) {
                alert("皮肤图片更新失败!")
                return;
            }
        }

        console.log(selCape)
        const r2 = await fetch("/api/profile/setInfo/" + profile.uuid, {
            body: JSON.stringify({
                username: profile.username,
                model: profile.model,
                cape: profile.cape[selCape].name === "无披风" ? "NONE" : profile.cape[selCape].uuid
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })

        if (r2.status !== 204) {
            alert("玩家信息更新失败!")
            return;
        }

        alert("更新成功! 如果用户名被更改, 则需要在启动器重新刷新令牌!");
    }

    async function updateUser(e: any) {
        e.preventDefault();
    }

    return (
        <PageBase selected="用户管理" admin={true}>
            <Typography level="body-sm">
                为了保护用户的信息安全，不支持在网页直接删除、新建用户数据，仅可以执行其他不伤害玩家数据的操作
            </Typography>
            <Stack alignItems="center" flexWrap="wrap" useFlexGap marginBottom={0.5} direction="row" spacing={2}>
                <Button color="success" onClick={() => setUvs(true)} startDecorator={<Add />}>新建 UVS 验证码</Button>
                <Button color="primary" onClick={() => setPlayer(true)} startDecorator={<Edit />}>修改角色/用户信息</Button>
            </Stack>

            <Grid display={profile.uuid === "" ? "none" : "flex"} justifyContent="flex-start" spacing={2} container>
                <Grid xs={12} sm={6} md={6}>
                    <Card
                        variant="outlined"
                        sx={{
                            mx: 'auto',
                            overflow: 'auto'
                        }}
                    >
                        <Typography level="title-lg" startDecorator={<Build />}>
                            角色信息
                        </Typography>
                        <Divider inset="none" />
                        <form onSubmit={updateProfie}>
                            <CardContent
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                    gap: 1.5,
                                }}
                            >
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>唯一识别码</FormLabel>
                                    <Input readOnly endDecorator={<BadgeOutlined />} value={profile.uuid} />
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>角色名</FormLabel>
                                    <Input name="playername" endDecorator={<PermIdentity />} onChange={(e) => setProfile({
                                        username: e.target.value,
                                        uuid: profile.uuid,
                                        model: profile.model,
                                        skin: profile.skin,
                                        skin_src: profile.skin_src,
                                        cape: profile.cape
                                    })} value={profile.username} />
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>游戏披风</FormLabel>
                                    <Select value={selCape} onChange={(e: any, value: any) => setSelCape(value)} startDecorator={<Flag />} name="cape">
                                        {
                                            profile.cape.map((cape, index) => {
                                                return (
                                                    <Option value={index}>{cape.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>游戏皮肤&披风</FormLabel>
                                    <Stack
                                        marginTop={2}
                                        direction="row"
                                        alignItems="flex-start"
                                        justifyContent="space-evenly"
                                        flexWrap="wrap"
                                    >
                                        <Stack
                                            spacing={2}
                                        >
                                            <RadioGroup name="model" value={profile.model} onChange={(e) => setProfile({
                                                username: profile.username,
                                                uuid: profile.uuid,
                                                model: e.target.value,
                                                skin: profile.skin,
                                                skin_src: profile.skin_src,
                                                cape: profile.cape
                                            })} defaultValue="default">
                                                <Radio
                                                    value="default"
                                                    label="默认(Steve)"
                                                />
                                                <Radio
                                                    value="slim"
                                                    label="纤细(Alex)"
                                                />
                                            </RadioGroup>
                                            <Button
                                                sx={{
                                                    minWidth: "120px",
                                                    marginBottom: "10px !important"
                                                }}
                                                component="label"
                                                role={undefined}
                                                tabIndex={-1}
                                                variant="outlined"
                                                color="neutral"
                                                startDecorator={<UploadFile />}
                                            >
                                                上传皮肤
                                                <VisuallyHiddenInput name="skin" onChange={skinChange} type="file" />
                                            </Button>
                                        </Stack>
                                        {
                                            profile.skin === "" ?
                                                null :
                                                <img alt="skin" src={profile.skin} style={{ imageRendering: "pixelated", marginBottom: "10px" }} width="100vw" height="100vh" id="skin_show" />
                                        }
                                        {
                                            profile.cape[selCape] === undefined || profile.cape[selCape].name === "无披风" ?
                                                null :
                                                <img alt="cape" src={window.location.href.replace("#/userManage", "textures/" + profile.cape[selCape].uuid)} style={{ imageRendering: "pixelated", marginBottom: "10px" }} width="100vw" height="100vh" id="cape_show" />
                                        }
                                    </Stack>
                                    <FormHelperText>如果右侧图片长时间未更新请检查浏览器缓存</FormHelperText>
                                </FormControl>
                                <CardActions sx={{ gridColumn: '1/-1' }}>
                                    <Button disabled={profile.uuid === ""} type="submit" variant="solid" color="primary">
                                        更新角色信息
                                    </Button>
                                </CardActions>
                            </CardContent>
                        </form>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                    <Card
                        variant="outlined"
                        sx={{
                            mx: 'auto',
                            overflow: 'auto'
                        }}
                    >
                        <Typography level="title-lg" startDecorator={<AccountBox />}>
                            用户信息
                        </Typography>
                        <Divider inset="none" />
                        <form onSubmit={updateUser}>
                            <CardContent
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                    gap: 1.5,
                                }}
                            >
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>用户名</FormLabel>
                                    <Input name="username" endDecorator={<PermIdentity />} onChange={(e) => setUser({
                                        uuid: user.uuid,
                                        username: e.target.value,
                                        password: user.password,
                                        admin: user.admin,
                                        mojang: user.mojang,
                                        registerTime: user.registerTime
                                    })} value={user.username} />
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1', '--hue': Math.min(user.password.length * 10, 120) }}>
                                    <FormLabel>新密码</FormLabel>
                                    <Input type="password" name="password_name" endDecorator={<Key />} onChange={(e) => setUser({
                                        uuid: user.uuid,
                                        username: user.username,
                                        password: e.target.value,
                                        admin: user.admin,
                                        mojang: user.mojang,
                                        registerTime: user.registerTime
                                    })} value={user.password} />
                                    <LinearProgress
                                        determinate
                                        size="sm"
                                        value={Math.min((user.password.length * 100) / 12, 100)}
                                        sx={{
                                            marginTop: "5px",
                                            bgcolor: 'background.level3',
                                            color: 'hsl(var(--hue) 80% 40%)',
                                        }}
                                    />
                                    <Typography
                                        level="body-xs"
                                        sx={{ alignSelf: 'flex-end', color: 'hsl(var(--hue) 80% 30%)' }}
                                    >
                                        {user.password.length < 3 && '太弱'}
                                        {user.password.length >= 3 && user.password.length < 6 && '弱'}
                                        {user.password.length >= 6 && user.password.length < 10 && '强'}
                                        {user.password.length >= 10 && '很强'}
                                    </Typography>
                                </FormControl>
                                <CardActions sx={{ gridColumn: '1/-1' }}>
                                    <Button disabled={profile.uuid === ""} type="submit" variant="solid" color="primary">
                                        更新用户信息
                                    </Button>
                                </CardActions>
                            </CardContent>
                        </form>
                    </Card>
                    <Card
                        variant="outlined"
                        sx={{
                            mx: 'auto',
                            overflow: 'auto',
                            marginTop: '10px'
                        }}
                    >
                        <Typography level="title-lg" startDecorator={<Message />}>
                            用户只读信息
                        </Typography>
                        <Divider inset="none" />
                        <Typography>
                            <b>用户唯一识别码</b>: {user.uuid}<br/>
                            <b>身份</b>: {user.admin ? "超级管理员" : "普通玩家"}<br/>
                            <b>正版 UUID</b>: {user.mojang}<br/>
                            <b>注册时间</b>: {new Date(user.registerTime).toLocaleString()}<br/>
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            <Modal
                open={uvs}
                onClose={() => setUvs(false)}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>新建 UVS 验证码</DialogTitle>
                    <form onSubmit={newUvsCode}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>玩家的无符号正版 UUID</FormLabel>
                                <Input name="uuid" />
                                <FormHelperText>应为 32 为数字与小写英文字符</FormHelperText>
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                新建验证码
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Modal
                open={player}
                onClose={() => setPlayer(false)}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>读取角色&用户信息以修改</DialogTitle>
                    <form onSubmit={getPlayer}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>角色识别码</FormLabel>
                                <Input name="uuid" />
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                获取角色&用户信息
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </PageBase>
    )
}