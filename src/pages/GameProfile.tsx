import { Button, Card, CardActions, CardContent, Divider, FormControl, FormHelperText, FormLabel, Grid, Input, Option, Radio, RadioGroup, Select, Stack, Typography, styled } from "@mui/joy";
import PageBase from "../components/PageBase";
import { AdsClick, BadgeOutlined, Flag, PermIdentity, PublicOutlined, Settings, UploadFile } from "@mui/icons-material";
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

    const [cslClick, setCslClick] = useState(false);
    const [selCape, setSelCape] = useState(0);
    const [profile, setProfile] = useState({
        username: "",
        uuid: "",
        model: "",
        skin: "",
        cape: [] as any[],
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

                                fetch("/api/profile/getUserCapes", {
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    method: "GET"
                                }).then((data) => {
                                    data.text().then((text) => {
                                        const data = JSON.parse(text);
                                        if (typeof (data.data) === "object") {
                                            setProfile({
                                                username: json.name,
                                                uuid: json.id,
                                                model: texture.textures.SKIN === undefined ? "default" : texture.textures.SKIN.metadata.model,
                                                skin: texture.textures.SKIN === undefined ? "" : texture.textures.SKIN.url,
                                                skin_src: profile.skin_src,
                                                cape: data.data
                                            })

                                            const show = document.getElementById("skin_show");
                                            if (texture.textures.SKIN !== undefined && show != null) {
                                                show.style.display = "block";
                                            }
                                        }
                                    })
                                })
                            })
                        })
                    }
                })
            });
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

        console.log(selCape)
        const r2 = await fetch("/api/profile/setInfo", {
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
                                        <img alt="skin" src={profile.skin} style={{ display: "none", imageRendering: "pixelated", marginBottom: "10px" }} width="100vw" height="100vh" id="skin_show" />
                                        {
                                            profile.cape[selCape] === undefined || profile.cape[selCape].name === "无披风" ?
                                                null :
                                                <img alt="cape" src={window.location.href.replace("#/gameProfile", "textures/" + profile.cape[selCape].uuid)} style={{ imageRendering: "pixelated", marginBottom: "10px" }} width="100vw" height="100vh" id="cape_show" />
                                        }
                                    </Stack>
                                    <FormHelperText>如果右侧图片长时间未更新请检查浏览器缓存</FormHelperText>
                                </FormControl>
                                <CardActions sx={{ gridColumn: '1/-1' }}>
                                    <Button disabled={profile.uuid === ""} type="submit" variant="solid" color="primary">
                                        更新设置
                                    </Button>
                                </CardActions>
                            </CardContent>
                        </form>
                    </Card>
                </Grid>
                <Grid xs={6}>
                    <Card
                        variant="outlined"
                        sx={{
                            mx: 'auto',
                            overflow: 'auto'
                        }}
                    >
                        <Typography level="title-lg" startDecorator={<PublicOutlined />}>
                            Custom Skin Loader API
                        </Typography>
                        <Divider inset="none" />
                        <Typography lineHeight={2} level="body-md">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            由于 Mojang 本身的 <b>限制</b> , 玩家在通行证中选择的披风在 <b>纯原版</b> 环境下并 <b>无法显示</b> , 为了能 <b>正常显示</b> 您与其他玩家的披风, 我们提供了 <b>Custom Skin Loader API</b> (CSL API) 用来与 Mod 搭配正常显示披风, 您可以在我们的 <a href="https://docs.qq.com/doc/DWnp2RFJXRVNJZGFE" target="blank">Mod 白名单</a> 中找到 <b>Custom Skin Loader</b> Mod, 使用教程如下:<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            1. 下载并安装 <b>Custom Skin Loader</b> Mod<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            2. 下载下面提供的 <b>ExtraList</b> 文件<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            3. 将下载的 <b>ExtraList</b> 文件放入 <Typography sx={{ wordBreak: "break-all" }} variant="soft" color="primary">.minecraft/CustomSkinLoader/ExtraList</Typography> 目录下<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            4. 重启游戏, 如果成功加载, ExtraList 会被 <b>自动删除</b>, 此时 BackroomsMC 便已被添加至 <b>Custom Skin Loader</b> 加载列表的顶部
                        </Typography>
                        <Typography marginBottom={2} level="body-xs">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    
                            ExtraList 是 CustomSkinLoader 提供的快捷添加皮肤站功能. 不需要任何繁琐的配置修改, 只需要使用 ExtraList 文件便可以快速添加皮肤加载器!
                        </Typography>
                        <Button
                            onClick={async () => {
                                window.open(window.location.href.replace("#/gameProfile", "textures/ExtraList.json"), '_blank');

                                setCslClick(true);
                                setTimeout(() => setCslClick(false), 2000);
                            }}
                            disabled={cslClick}
                            startDecorator={<AdsClick />}
                        >
                            {cslClick ? "正在下载 ExtraList..." : "点击此按钮下载 ExtraList 文件"}
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </PageBase>
    )
}