import { Button, Card, Divider, Grid, Link, Stack, Typography } from "@mui/joy";
import PageBase from "../components/PageBase";
import { AdsClick, Announcement, PermIdentity, Plumbing } from "@mui/icons-material";
import { useState } from "react";

export default function OverView() {
    const [yggClick, setyggClick] = useState(false);

    return (
        <PageBase selected="仪表盘">
            <Grid justifyContent="flex-start" spacing={2} container>
                <Grid xs={12}>
                    <Card
                        variant="outlined"
                        sx={{
                            mx: 'auto',
                            overflow: 'auto'
                        }}
                    >
                        <Typography level="title-lg" startDecorator={<Announcement />}>
                            公告
                        </Typography>
                        <Divider inset="none" />
                        <Typography lineHeight={2} level="body-md">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            欢迎使用{' '}
                            <Typography variant="soft" color="primary">BackroomsMC 统一通行证</Typography>{' '}
                            ! 由 <b>BackroomsMC 技术组</b> 制作, <b>Xiaoyi311</b> 主编, 一个自主制作的 <b>玩家账号管理</b> 系统！
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            当你看到这个页面时, 则代表你的 <b>通行证账号</b> 已经{' '}
                            <Typography variant="soft" color="success">正常运行</Typography>{' '}
                            ! 如果需要修改 <b>游戏账号</b> 的{' '}
                            <Typography variant="outlined" color="neutral">皮肤</Typography>{' '}
                            , 请前往左侧菜单的{' '}
                            <Link href="/#/gameProfile">游戏角色</Link>{' '}
                            页面, {' '}
                            <Typography variant="soft" color="success">自定义皮肤与游戏名</Typography>{' '}
                            , 不过请注意, <b>披风</b> 不支持自定义,仅能由{' '}
                            <Typography variant="outlined" color="neutral">通行证管理员</Typography>{' '}
                            发放, 你可以在我们举办的 <b>活动</b> 中得到{' '}
                            <Typography variant="soft" color="primary">披风奖励</Typography>{' '}
                            !
                        </Typography>
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
                        <Typography level="title-lg" startDecorator={<Plumbing />}>
                            Yggdrasil 接口
                        </Typography>
                        <Divider inset="none" />
                        <Typography lineHeight={2} level="body-md">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            为了方便玩家使用 <b>自己的启动器</b> 启动游戏, 我们对外提供基于 <b>Yggdrasil 协议</b> 的外置登录接口!<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Yggdrasil API 地址:{' '}
                            <Typography sx={{ wordWrap: "break-word" }} variant="soft" color="primary">{window.location.href.replace("#/overview", "api/yggdrasil/")}</Typography>{' '}
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            你可以通过 <b>单击</b> 下面按钮 <b>复制 API 地址</b> 的方法在启动器内添加, 也可以通过将下面按钮 <b>拖到</b> 启动器内的方法 <b>自动配置</b> API 地址!<br />
                        </Typography>
                        <Divider inset="none" />
                        <Button
                            draggable
                            onClick={() => {
                                setyggClick(true);
                                setTimeout(() => setyggClick(false), 1000);
                            }}
                            onDragStart={(e) => {
                                const a = "authlib-injector:yggdrasil-server:" + encodeURIComponent(window.location.href.replace("#/overview", "api/yggdrasil/"));
                                if (e.dataTransfer != null) {
                                    e.dataTransfer.setData("text/plain", a);
                                    e.dataTransfer.dropEffect = "copy";
                                }
                            }}
                            disabled={yggClick}
                            startDecorator={<AdsClick />}
                        >
                            {yggClick ? "已复制 API 地址!" : "点击/拖动此按钮配置 API 地址"}
                        </Button>
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
                        <Typography level="title-lg" startDecorator={<PermIdentity />}>
                            Staff & OP 公示
                        </Typography>
                        <Divider inset="none" />
                        <Typography lineHeight={2} level="body-md">
                            以下为在服务器内有 <b>特殊权限</b> 的用户, 如果你发现某人拥有 <b>特殊权限</b> 且他的名字不在这里, 请提交给 <b>管理组/Staff</b> !<br />
                        </Typography>
                        <Stack justifyContent="space-evenly" direction="row">
                            <Typography textAlign="center" fontSize={15} level="body-md">
                                KusiluChennn(OP)<br />
                                MoonCakeh2so4(OP)<br />
                                Mr_Sea_0(OP)<br />
                                Leo(OP)<br />
                                Xiaoyi311(OP)<br />
                            </Typography>
                            <Typography textAlign="center" fontSize={15} level="body-md">
                                SmallGarfield(OP)<br />
                                杨ID忘了(OP)<br />
                                缄默ID忘了(Staff)<br />
                                皇鱼ID忘了(Staff)<br />
                            </Typography>
                        </Stack>
                        <Typography level="body-xs">
                            注: <br />
                            以上名称格式: 游戏ID(类型)<br />
                            OP 为服务器管理, 拥有全部权限, 通常为管理组<br />
                            Staff 为服务器巡查, 维护游戏环境, 拥有部分权限, 通常为建设组审核后的成员
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </PageBase>
    )
}