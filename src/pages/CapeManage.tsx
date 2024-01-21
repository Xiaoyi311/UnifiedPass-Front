import { Button, Card, DialogTitle, Divider, FormControl, FormLabel, Grid, IconButton, Input, Modal, ModalClose, ModalDialog, Option, Select, Stack, Typography, styled } from "@mui/joy";
import PageBase from "../components/PageBase";
import { Add, ArrowLeft, ArrowRight, Edit, Refresh, Remove, UploadFile } from "@mui/icons-material";
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

    interface FormElements extends HTMLFormControlsCollection {
        name: HTMLInputElement;
        type: HTMLInputElement;
        cape: HTMLInputElement;
    }
    interface CapeFormElement extends HTMLFormElement {
        readonly elements: FormElements;
    }

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

    async function aeCape(e: React.FormEvent<CapeFormElement>) {
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

    return (
        <PageBase selected="披风管理" admin={true}>
            <Stack flexWrap="wrap" useFlexGap marginBottom={0.5} direction="row" spacing={2}>
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
            </Stack>
            <Grid container justifyContent="space-evenly" spacing={2}>
                {
                    capes.map((cape) => {
                        return (
                            <Grid sm={6} xs={12} md={6}>
                                <Card>
                                    <Typography level="title-lg">{cape.name}<br /><Typography level="body-xs">{cape.uuid}</Typography></Typography>
                                    <Divider inset="none" />
                                    <Stack alignItems="center" justifyContent="space-evenly" direction="row" spacing={1.5}>
                                        {
                                            cape.url === "" ? <Typography color="danger">未指定!!!!</Typography> : <img style={{ imageRendering: "pixelated", objectFit: "contain", width: "30%" }} alt="cape" src={window.location.href.replace("#/capeManage", "textures/" + cape.url)} />
                                        }
                                        <Divider orientation="vertical" />
                                        <Stack spacing={1.5}>
                                            <Typography>皮肤类型：<Typography variant="soft" color="primary"><b>{getType(cape.type) + "披风"}</b></Typography></Typography>
                                            <Typography>创建时间：<Typography variant="soft" color="primary"><b>{new Date(Number.parseInt(cape.createTime)).toLocaleString()}</b></Typography></Typography>
                                            <Typography>更改时间：<Typography variant="soft" color="primary"><b>{new Date(Number.parseInt(cape.editTime)).toLocaleString()}</b></Typography></Typography>
                                            <Stack direction="row" spacing={0.5}>
                                                <Button onClick={() => setCape({
                                                    open: true,
                                                    cape: window.location.href.replace("#/capeManage", "textures/" + cape.url),
                                                    src: "",
                                                    edit: true,
                                                    name: cape.name,
                                                    type: cape.type,
                                                    uuid: cape.uuid
                                                })} startDecorator={<Edit />}>编辑</Button>
                                                <Button onClick={() => delCape(cape.uuid)} startDecorator={<Remove />} color="danger">删除</Button>
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
                                <Select value={cape.type} onChange={(e: any) => {
                                    setCape({
                                        open: true,
                                        name: cape.name,
                                        type: e.value,
                                        cape: cape.cape,
                                        src: cape.src,
                                        edit: cape.edit,
                                        uuid: cape.uuid
                                    })
                                }} name="type">
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
        </PageBase>
    );
}