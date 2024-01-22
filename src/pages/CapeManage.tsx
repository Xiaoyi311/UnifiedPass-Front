import { Button, Card, DialogTitle, Divider, FormControl, FormHelperText, FormLabel, Grid, IconButton, Input, Modal, ModalClose, ModalDialog, Option, Select, Stack, Tooltip, Typography, styled } from "@mui/joy";
import PageBase from "../components/PageBase";
import { Add, ArrowLeft, ArrowRight, BackHand, Edit, FindInPage, Refresh, Remove, Send, UploadFile } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function CapeManage() {
    const [cape, setCape] = useState({
        open: false,
        name: "",
        type: "",
        uuid: "" as any,
        cape: "",
        src: "" as any,
        edit: false
    });

    const [delWarn, setDelWarn] = useState("" as any);
    const [looking, setLooking] = useState("");
    const [findUser, setFindUser] = useState(false);
    const [sendCape, setSendCape] = useState("");
    const [backCape, setBackCape] = useState("");
    const [first, setFirst] = useState(true);
    const [capes, setCapes] = useState<any[]>([]);
    const [page, setPage] = useState({
        page: 0,
        total: 0
    });

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

    useEffect(() => {
        if (first) {
            setFirst(false);
            pageChange(0);
        }
    }, [first, pageChange])

    function pageChange(pagec: number) {
        if (pagec !== 0 && (pagec + 1 > page.total || pagec < 0)) {
            return;
        }

        setLooking("");
        fetch("/api/profile/getCapes?page=" + pagec).then((data) => {
            data.text().then((text) => {
                const data = JSON.parse(text).data;
                setCapes(data.capes);
                setPage({
                    page: pagec,
                    total: data.total
                })
            })
        });
    }

    function capeChange(e1: any) {
        const file = e1.target.files[0];
        const fileName = e1.target.value.substring(e1.target.value.indexOf("."));
        if (fileName !== ".png") {
            alert("仅支持 png 文件!");
            e1.target.value = "";
            return;
        }
        // 检查宽高是否为64x32的整数倍
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
                if ((width % 64 !== 0 || height % 32 !== 0)) {
                    alert('图片不合法');
                    e1.target.value = "";
                    return;
                }

                const show: any = document.getElementById("cape_show");
                show.style.display = "block";
                setCape({
                    open: true,
                    cape: typeof (reader.result) == "string" ? reader.result : "",
                    src: file,
                    edit: cape.edit,
                    name: cape.name,
                    type: cape.type,
                    uuid: cape.uuid
                })
            }
            img.src = typeof (e.target?.result) == "string" ? e.target?.result : "";
        }
    }

    async function aeCape(e: any) {
        e.preventDefault();
        if (cape.cape === "") {
            alert("请指定披风文件!")
            return;
        }

        const r1 = await fetch("/api/profile/setCape", {
            body: JSON.stringify({
                uuid: cape.uuid === "" ? null : cape.uuid,
                name: e.currentTarget.elements.name.value,
                type: (e.currentTarget.elements.type as any)[1].value
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })

        if (r1.status !== 200) {
            alert("披风添加/编辑失败!");
            return;
        }

        const res = JSON.parse(await r1.text());

        if (cape.src !== "") {
            const fileData = new FormData();
            fileData.append("file", cape.src, cape.src.name);
            const r1 = await fetch("/api/profile/uploadCape/" + res.data.uuid, {
                body: fileData,
                method: "POST"
            });

            if (r1.status !== 204) {
                alert("披风图片更新失败!")
                return;
            }
        }

        alert("披风添加/编辑成功!");
        setCape({
            open: false,
            cape: "",
            src: "",
            edit: false,
            name: "",
            type: "",
            uuid: ""
        })
    }

    function delCape(uuid: string) {
        fetch("/api/profile/delCape", {
            body: JSON.stringify({
                uuid: uuid
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE"
        })

        alert("已请求删除披风, 请手动刷新数据!");
    }

    function getType(type: any) {
        switch (type) {
            case "PERMISSION":
                return "权限";
            case "ACTIVITY":
                return "活动";
            case "REWARD":
                return "补偿";
            case "PRIZE":
                return "奖励";
            case "SPECIAL":
                return "特殊";
            default:
                return "未知";
        }
    }

    async function sendCapeF(e: any) {
        e.preventDefault();

        const r = await fetch("/api/profile/sendCape", {
            body: JSON.stringify({
                cape: sendCape,
                user: e.currentTarget.elements.uuid.value
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })


        if (r.status !== 204) {
            alert("发放失败! 请检查唯一识别码是否有误或者重复发放!");
        } else {
            alert("发放成功!");
        }

        setSendCape("");
    }

    async function backCapeF(e: any) {
        e.preventDefault();

        const r = await fetch("/api/profile/backCape", {
            body: JSON.stringify({
                cape: backCape,
                user: e.currentTarget.elements.uuid.value
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })


        if (r.status !== 204) {
            alert("收回失败! 请检查唯一识别码是否有误或者重复收回!");
        } else {
            alert("收回成功!");
        }

        setBackCape("");
    }

    async function findUserF(e: any) {
        e.preventDefault();

        const uuid = e.currentTarget.elements.uuid.value;
        const r = await fetch("/api/profile/getUserCapes/" + uuid, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET"
        })

        const data = JSON.parse(await r.text());
        if (typeof (data.data) !== "object") {
            alert("查询失败! 请检查唯一识别码是否有误!");
        } else {
            setLooking("角色 " + uuid + " 的披风列表, 第一个显示的披风为正在使用的披风");
            setCapes(data.data);
            alert("查询成功! 点击上方刷新数据恢复显示!");
        }

        setFindUser(false);
    }

    return (
        <PageBase selected="披风管理" admin={true}>
            <Stack alignItems="center" flexWrap="wrap" useFlexGap marginBottom={0.5} direction="row" spacing={2}>
                <Button color="success" onClick={() => setCape({
                    open: true,
                    cape: "",
                    src: "",
                    edit: false,
                    name: "",
                    type: "ACTIVITY",
                    uuid: ""
                })} startDecorator={<Add />}>新建披风</Button>
                <Button onClick={() => pageChange(0)} color="neutral" startDecorator={<Refresh />}>刷新数据</Button>
                <Button onClick={() => setFindUser(true)} color="primary" startDecorator={<FindInPage />}>查询角色拥有的披风</Button>
                {looking !== "" ? <Typography level="body-sm">你正在查看 {looking}</Typography> : null}
            </Stack>
            <Grid container justifyContent="space-evenly" spacing={2}>
                {
                    capes.map((cape) => {
                        return (
                            <Grid sm={6} xs={12} md={6}>
                                <Card>
                                    <Typography level="title-lg">{cape.name}<br /><Typography level="body-xs">{cape.name !== "无披风" ? cape.uuid : "不定义"}</Typography></Typography>
                                    <Divider inset="none" />
                                    <Stack alignItems="center" justifyContent="space-evenly" direction="row" spacing={1.5}>
                                        {
                                            cape.name !== "无披风" ?
                                            <img style={{ imageRendering: "pixelated", objectFit: "contain", width: "30%" }} alt="cape" src={window.location.href.replace("#/capeManage", "textures/" + cape.uuid)} /> :
                                            <Typography color="warning">不使用披风</Typography>
                                        }
                                        <Divider orientation="vertical" />
                                        <Stack spacing={1.5}>
                                            <Typography>皮肤类型：<Typography variant="soft" color="primary"><b>{cape.name !== "无披风" ? getType(cape.type) + "披风" : "不定义"}</b></Typography></Typography>
                                            <Typography>创建时间：<Typography variant="soft" color="primary"><b>{cape.name !== "无披风" ? new Date(Number.parseInt(cape.createTime)).toLocaleString() : "不定义"}</b></Typography></Typography>
                                            <Typography>更改时间：<Typography variant="soft" color="primary"><b>{cape.name !== "无披风" ? new Date(Number.parseInt(cape.editTime)).toLocaleString() : "不定义"}</b></Typography></Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="编辑">
                                                    <IconButton disabled={cape.name === "无披风"} size="sm" variant="solid" onClick={() => setCape({
                                                        open: true,
                                                        cape: window.location.href.replace("#/capeManage", "textures/" + cape.uuid),
                                                        src: "",
                                                        edit: true,
                                                        name: cape.name,
                                                        type: cape.type,
                                                        uuid: cape.uuid
                                                    })} color="primary"><Edit /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="删除">
                                                    <IconButton disabled={cape.name === "无披风"} variant="solid" size="sm" onClick={() => setDelWarn(cape)} color="danger"><Remove /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="发放">
                                                    <IconButton disabled={cape.name === "无披风"} variant="solid" size="sm" onClick={() => setSendCape(cape.uuid)} color="success"><Send /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="收回">
                                                    <IconButton disabled={cape.name === "无披风"} variant="solid" size="sm" onClick={() => setBackCape(cape.uuid)} color="neutral"><BackHand /></IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
            <Stack marginTop={0.5} spacing={2} alignItems="center" direction="row" justifyContent="right">
                <IconButton onClick={() => pageChange(page.page - 1)} size="sm" variant="soft">
                    <ArrowLeft />
                </IconButton>
                <Typography level="body-sm">第 {page.page + 1} 页 / 共 {page.total} 页</Typography>
                <IconButton onClick={() => pageChange(page.page + 1)} size="sm" variant="soft">
                    <ArrowRight />
                </IconButton>
            </Stack>
            <Modal
                open={cape.open}
                onClose={() => setCape({
                    open: false,
                    cape: "",
                    src: "",
                    edit: cape.edit,
                    name: "",
                    type: "",
                    uuid: cape.uuid
                })}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>{cape.edit ? "编辑所选" : "添加新"}披风</DialogTitle>
                    <form onSubmit={aeCape}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>披风名</FormLabel>
                                <Input value={cape.name} onChange={(e: any) => {
                                    setCape({
                                        open: true,
                                        name: e.currentTarget.value,
                                        type: cape.type,
                                        cape: cape.cape,
                                        src: cape.src,
                                        edit: cape.edit,
                                        uuid: cape.uuid
                                    })
                                }} name="name" />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>披风类型</FormLabel>
                                <Select value={cape.type} onChange={(e: any, value: any) => 
                                    setCape({
                                        open: true,
                                        name: cape.name,
                                        type: value,
                                        cape: cape.cape,
                                        src: cape.src,
                                        edit: cape.edit,
                                        uuid: cape.uuid
                                    })
                                } name="type">
                                    <Option value="ACTIVITY">活动披风</Option>
                                    <Option value="PERMISSION">权限披风</Option>
                                    <Option value="REWARD">补偿披风</Option>
                                    <Option value="PRIZE">奖励披风</Option>
                                    <Option value="SPECIAL">特殊披风</Option>
                                </Select>
                            </FormControl>
                            <FormControl required>
                                <FormLabel>游戏披风</FormLabel>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-evenly"
                                >
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
                                        上传披风
                                        <VisuallyHiddenInput onChange={capeChange} name="cape" type="file" />
                                    </Button>
                                    {
                                        cape.cape === "" ?
                                            <img alt="cape" src={cape.cape} style={{ display: "none", imageRendering: "pixelated" }} width="100vw" height="100vh" id="cape_show" /> :
                                            <img alt="cape" src={cape.cape} style={{ imageRendering: "pixelated" }} width="100vw" height="100vh" id="cape_show" />
                                    }
                                </Stack>
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                {cape.edit ? "编辑" : "添加"}皮肤
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Modal
                open={sendCape !== ""}
                onClose={() => setSendCape("")}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>发放所选披风</DialogTitle>
                    <form onSubmit={sendCapeF}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>被发放角色唯一识别码</FormLabel>
                                <Input name="uuid" />
                                <FormHelperText>可在 统一通行证-游戏角色-唯一识别码 处复制</FormHelperText>
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                发放披风
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Modal
                open={backCape !== ""}
                onClose={() => setBackCape("")}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>收回所选披风</DialogTitle>
                    <form onSubmit={backCapeF}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>被收回角色唯一识别码</FormLabel>
                                <Input name="uuid" />
                                <FormHelperText>可在 统一通行证-游戏角色-唯一识别码 处复制</FormHelperText>
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                收回披风
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Modal
                open={findUser}
                onClose={() => setFindUser(false)}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>查询角色拥有的披风</DialogTitle>
                    <form onSubmit={findUserF}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>查询角色唯一识别码</FormLabel>
                                <Input name="uuid" />
                                <FormHelperText>可在 统一通行证-游戏角色-唯一识别码 处复制</FormHelperText>
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                查询披风
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Modal
                open={delWarn !== ""}
                onClose={() => setDelWarn("")}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>你确定要删除这个披风吗</DialogTitle>
                    <Typography>
                        警告! 此操作 <b>无法撤销</b> ! 一旦删除披风, 拥有此披风的角色会被 <b>收回披风</b> , 错误的删除披风可能会造成 <b>很多麻烦</b> ! 请 <b>核对</b> 被删除披风信息!<br/><br/>

                        <Typography level="body-lg">
                            披风 UUID: <b>{delWarn.uuid}</b><br/>
                            披风名称: <b>{delWarn.name}</b><br/>
                            披风类型: <b>{getType(delWarn.type)}披风</b>
                        </Typography>
                    </Typography>
                    <img alt="cape" src={window.location.href.replace("#/capeManage", "textures/" + delWarn.uuid)} style={{ imageRendering: "pixelated" }} width="100vw" height="100vh" />
                    <Button onClick={() => {
                        delCape(delWarn.uuid);
                        setDelWarn("");
                    }} variant="solid" color="danger">
                        确定删除
                    </Button>
                </ModalDialog>
            </Modal>
        </PageBase>
    );
}