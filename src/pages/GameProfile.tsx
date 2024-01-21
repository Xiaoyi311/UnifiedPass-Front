import { Button, Card, CardActions, CardContent, Divider, FormControl, FormHelperText, FormLabel, Grid, Input, Option, Radio, RadioGroup, Select, Stack, Typography, styled } from "@mui/joy";
import PageBase from "../components/PageBase";
import { BadgeOutlined, Flag, PermIdentity, Settings, UploadFile } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function GameProfile() {
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

    const [profile, setProfile] = useState({
        username: "",
        uuid: "",
        model: "",
        skin: "",
        cape: "",
        skin_src: new File([], "un")
    });

    useEffect(() => {
        if (profile.username === "") {
            fetch("/api/auth/info").then((data) => {
                data.text().then((text) => {
                    const json = JSON.parse(text);
                    if (json.status === 200) {
                        fetch("/api/yggdrasil/sessionserver/session/minecraft/profile/" + json.data.profile).then((data) => {
                            data.text().then((text) => {
                                const json = JSON.parse(text);
                                const texture = JSON.parse(atob(json.properties[0].value))
                                setProfile({
                                    username: json.name,
                                    uuid: json.id,
                                    model: texture.textures.SKIN === undefined ? "default" : texture.textures.SKIN.metadata.model,
                                    skin: texture.textures.SKIN === undefined ? "" : texture.textures.SKIN.url,
                                    skin_src: profile.skin_src,
                                    cape: texture.textures.CAPE === undefined ? "" : texture.textures.CAPE.url
                                })
                                const show = document.getElementById("skin_show");
                                if (texture.textures.SKIN !== undefined && show != null) {
                                    show.style.display = "block";
                                }
                            })
                        })
                    }
                })
            })
        }
    })

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

                const show: any = document.getElementById("skin_show");
                show.style.display = "block";
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
            const r1 = await fetch("/api/profile/uploadSkin", {
                body: fileData,
                method: "POST"
            });

            if (r1.status !== 204) {
                alert("皮肤图片更新失败!")
                return;
            }
        }

        const r2 = await fetch("/api/profile/setInfo", {
            body: JSON.stringify({
                username: profile.username,
                model: profile.model
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

    return (
        <PageBase selected="游戏角色">
            <Grid justifyContent="flex-start" spacing={2} container>
                <Grid xs={12} sm={6} md={6}>
                    <Card
                        variant="outlined"
                        sx={{
                            mx: 'auto',
                            overflow: 'auto'
                        }}
                    >
                        <Typography level="title-lg" startDecorator={<Settings />}>
                            角色基本设置
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
                                    <Select defaultValue={0} startDecorator={<Flag/>} name="cape">
                                        <Option value={0}>无披风</Option>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>游戏皮肤</FormLabel>
                                    <Stack
                                        marginTop={2}
                                        direction="row"
                                        alignItems="flex-start"
                                        justifyContent="space-evenly"
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
                                                    minWidth: "120px"
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
                                        <img alt="skin" src={profile.skin} style={{ display: "none", imageRendering: "pixelated" }} width="100vw" height="100vh" id="skin_show" />
                                        <img alt="cape" src={profile.cape} style={{ display: "none", imageRendering: "pixelated" }} width="100vw" height="100vh" id="cape_show" />
                                    </Stack>
                                    <FormHelperText>如果右侧图片长时间未更新请检查浏览器缓存</FormHelperText>
                                </FormControl>
                                <CardActions sx={{ gridColumn: '1/-1' }}>
                                    <Button type="submit" variant="solid" color="primary">
                                        更新设置
                                    </Button>
                                </CardActions>
                            </CardContent>
                        </form>
                    </Card>
                </Grid>
            </Grid>
        </PageBase>
    )
}