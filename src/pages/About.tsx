import { Avatar, Card, Divider, Grid, Link, Stack, Typography } from "@mui/joy";
import PageBase from "../components/PageBase";
import { buildMember, sponsor } from "../utils";

export default function About() {
    return (
        <PageBase selected="关于我们">
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <img alt="icon" style={{
                    width: "100px"
                }} src="icon.png" />
                <Stack>
                    <Typography sx={(theme) => ({
                        background: "linear-gradient(45deg, #2d2d2d 5%, #616161 90%)",
                        [theme.getColorSchemeSelector('dark')]: {
                            background: "linear-gradient(45deg, #bdbbbb 5%, #7d7d7d 90%)",
                            backgroundClip: "text"
                        },
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    })} level="h1">Backrooms MC</Typography>
                    <Typography level="body-md">Fandom 版我的世界后室服务器</Typography>
                </Stack>
            </Stack>
            <Divider sx={{ marginTop: "20px", marginBottom: "20px" }}>管理层成员</Divider>
            <Grid justifyContent="center" container spacing={4}>
                <Grid xs={24} sm={4}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a29205871b83018a1be4b3.jpg" sx={{ width: "70px", height: "70px" }} />
                        <Stack>
                            <Typography fontSize={25} level="title-lg">酷晨</Typography>
                            <Typography level="body-md">项目负责人</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid xs={24} sm={4}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a29268871b83018a1de435.jpg" sx={{ width: "70px", height: "70px" }} />
                        <Stack>
                            <Typography fontSize={25} level="title-lg">硫酸月饼</Typography>
                            <Typography level="body-md">项目负责人</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid xs={24} sm={4}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a2927b871b83018a1e4154.jpg" sx={{ width: "70px", height: "70px" }} />
                        <Stack>
                            <Typography fontSize={25} level="title-lg">海游</Typography>
                            <Typography level="body-md">项目负责人</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                {/* ==== 组长 ==== */}
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a296d4871b83018a33b0d6.jpg" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">VK</Typography>
                            <Typography level="body-sm">美工组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a296fa871b83018a347528.jpg" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">洛梵天</Typography>
                            <Typography level="body-sm">建筑组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a2971b871b83018a350b50.jpg" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">Leo</Typography>
                            <Typography level="body-sm">技术组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a2974a871b83018a35dc28.png" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">Xiaoyi311</Typography>
                            <Typography level="body-sm">技术组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a29767871b83018a366ddc.jpg" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">Yang</Typography>
                            <Typography level="body-sm">技术组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a29783871b83018a36e98a.jpg" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">杨辰七</Typography>
                            <Typography level="body-sm">人务组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid sm={3} xs={6}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar variant="outlined" src="https://pic.imgdb.cn/item/65a2979c871b83018a375ac6.jpg" sx={{ width: "50px", height: "50px" }} />
                        <Stack>
                            <Typography level="title-lg">加菲</Typography>
                            <Typography level="body-sm">音效组组长</Typography>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
            <Divider sx={{ marginTop: "20px", marginBottom: "20px" }}>建设组成员</Divider>
            <Stack justifyContent="center" flexWrap="wrap" direction="row" spacing={2} useFlexGap>
                {buildMember.map((member) => <Typography level="body-md">{member}</Typography>)}
            </Stack>
            <Typography marginTop="15px" level="title-lg" width="100%" textAlign="center">在此, 感谢所有建筑组成员对 BackroomsMC 的付出!</Typography>
            <Divider sx={{ marginTop: "20px", marginBottom: "20px" }}>最新赞助者</Divider>
            <Stack justifyContent="center" flexWrap="wrap" direction="row" spacing={1.5} useFlexGap>
                {sponsor.map((sponsor) => <Typography level="body-sm" sx={(theme) => ({
                    color: "#725200",
                    [theme.getColorSchemeSelector('dark')]: {
                        color: "gold"
                    },
                })}>{sponsor}</Typography>)}
            </Stack>
            <Typography sx={(theme) => ({
                color: "#725200",
                [theme.getColorSchemeSelector('dark')]: {
                    color: "gold"
                },
            })} marginTop="15px" level="title-lg" width="100%" textAlign="center">感谢你们对 BackroomsMC 的支持!</Typography>
            <Divider sx={{ marginTop: "20px", marginBottom: "20px" }}>特别鸣谢</Divider>
            <Grid spacing={2} justifyContent="center" container>
                <Grid justifyContent="center">
                    <Card sx={{ "--Card-padding": "0px" }}>
                        <Stack justifyContent="center" direction="row" marginRight={3}>
                            <img alt="fandom" width={100} height={100} src="https://pic.imgdb.cn/item/65a30f65871b83018a96c440.webp" />
                            <Stack justifyContent="center">
                                <Link target="_blank" color="neutral" overlay href="https://backrooms.fandom.com/zh/wiki" level="h3">Fandom 后室中文</Link>
                                <Typography level="body-md">你曾经来过这里...</Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </PageBase>
    )
}