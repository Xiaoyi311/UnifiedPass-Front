import { Button, Card, DialogTitle, Divider, FormControl, FormHelperText, FormLabel, Grid, Input, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";
import PageBase from "../components/PageBase";
import { Add, Edit, Refresh, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function OAuthManager() {
    const [first, setFirst] = useState(true);
    const [apps, setApps] = useState<any[]>([]);
    const [create, setCreate] = useState<boolean>(false);
    const [edit, setEdit] = useState<any>({
        client_id: '',
        name: '',
        des: '',
        website: '',
        callback: '',
        permission: '',
        authMode: ''
    });

    useEffect(() => {
        if (first) {
            setFirst(false);
            flush();
        }
    }, [first, setApps])

    async function flush() {
        const rep = await fetch('/api/oauth/list');
        const text = await rep.text();
        setApps(JSON.parse(text).data);
    }

    function remove(id: string) {
        fetch('/api/oauth/delete', {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
                clientId: id
            }),
        });

        setTimeout(() => {
            flush();
        }, 500);
    }

    async function createApp(e: any) {
        e.preventDefault();

        fetch('/api/oauth/create', {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
                name: e.currentTarget.elements.name.value,
                callback: e.currentTarget.elements.callback.value
            }),
        });

        setTimeout(() => {
            flush();
        }, 500);

        setCreate(false);
    }

    async function editApp(e: any) {
        e.preventDefault();

        fetch('/api/oauth/set', {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(edit),
        });

        setTimeout(() => {
            flush();
        }, 500);

        setEdit({
            client_id: '',
            name: '',
            des: '',
            website: '',
            callback: '',
            permission: '',
            authMode: ''
        });
    }

    return (
        <PageBase selected="OAuth 管理" admin={true}>
            <Stack alignItems="center" flexWrap="wrap" useFlexGap marginBottom={0.5} direction="row" spacing={2}>
                <Button color="success" onClick={() => setCreate(true)} startDecorator={<Add />}>新建应用程序</Button>
                <Button color="neutral" onClick={flush} startDecorator={<Refresh />}>刷新数据</Button>
            </Stack>
            <Grid container justifyContent="space-evenly" spacing={2}>
                {
                    apps.map((app) => {
                        return (
                            <Grid sm={6} xs={12} md={6}>
                                <Card>
                                    <Typography level="title-lg">{app.name} <Typography level="body-xs">{app.des}</Typography></Typography>
                                    <Divider inset="none" />
                                    <Stack spacing={1.5}>
                                        <Typography>ID: <Typography level="body-xs" variant="soft" color="primary" noWrap={false}><b>{app.clientId}</b></Typography></Typography>
                                        <Typography>Secret: <Typography level="body-xs" variant="soft" color="primary"><b>{app.clientSecret}</b></Typography></Typography>
                                        <Typography>应用主页: <Typography level="body-xs" variant="soft" color="primary"><b>{app.website}</b></Typography></Typography>
                                        <Typography>回调地址: <Typography level="body-xs" variant="soft" color="primary"><b>{app.callback}</b></Typography></Typography>
                                        <Typography>允许的申请权限: <Typography level="body-xs" variant="soft" color="primary"><b>{app.permission}</b></Typography></Typography>
                                        <Typography>允许的验证模式: <Typography level="body-xs" variant="soft" color="primary"><b>{app.authMode}</b></Typography></Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button onClick={() => setEdit({
                                                client_id: app.clientId,
                                                name: app.name,
                                                des: app.des,
                                                website: app.website,
                                                callback: app.callback,
                                                permission: app.permission,
                                                authMode: app.authMode
                                            })} variant="solid" size="sm" color="primary" startDecorator={<Edit />}>编辑 App</Button>
                                            <Button onClick={() => remove(app.clientId)} variant="solid" size="sm" color="danger" startDecorator={<Remove />}>删除 App</Button>
                                        </Stack>
                                    </Stack>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
            <Modal
                open={create}
                onClose={() => setCreate(false)}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>新建 OAuth App</DialogTitle>
                    <form onSubmit={createApp}>
                        <Stack spacing={1.5}>
                            <FormControl required>
                                <FormLabel>应用程序名</FormLabel>
                                <Input name="name" />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>回调地址</FormLabel>
                                <Input name="callback" />
                            </FormControl>
                            <Button type="submit" variant="solid" color="primary">
                                新建 App
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Modal
                open={edit.client_id !== ''}
                onClose={() => setEdit({
                    client_id: '',
                    name: '',
                    des: '',
                    website: '',
                    callback: '',
                    permission: '',
                    authMode: ''
                })}
            >
                <ModalDialog layout="center">
                    <ModalClose />
                    <DialogTitle>修改 OAuth App</DialogTitle>
                    <form onSubmit={editApp}>
                        <Stack direction="row" spacing={3}>
                            <Stack spacing={1.5}>
                                <FormControl required>
                                    <FormLabel>应用程序名</FormLabel>
                                    <Input name="name" value={edit.name} onChange={(e) => setEdit({
                                        ...edit,
                                        name: e.currentTarget.value
                                    })}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>应用备注</FormLabel>
                                    <Input name="des" value={edit.des} onChange={(e) => setEdit({
                                        ...edit,
                                        des: e.currentTarget.value
                                    })}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>应用主页</FormLabel>
                                    <Input name="website" value={edit.website} onChange={(e) => setEdit({
                                        ...edit,
                                        website: e.currentTarget.value
                                    })}/>
                                </FormControl>
                                <Button type="submit" variant="solid" color="primary">
                                    修改 App
                                </Button>
                            </Stack>
                            <Stack spacing={1.5}>
                                <FormControl required>
                                    <FormLabel>回调地址</FormLabel>
                                    <Input name="callback" value={edit.callback} onChange={(e) => setEdit({
                                        ...edit,
                                        callback: e.currentTarget.value
                                    })}/>
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>允许的申请权限</FormLabel>
                                    <Input name="permission" value={edit.permission} onChange={(e) => setEdit({
                                        ...edit,
                                        permission: e.currentTarget.value
                                    })}/>
                                    <FormHelperText>多个用空格分割</FormHelperText>
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>允许的验证模式</FormLabel>
                                    <Input name="authMode" value={edit.authMode} onChange={(e) => setEdit({
                                        ...edit,
                                        authMode: e.currentTarget.value
                                    })}/>
                                    <FormHelperText>多个用空格分割</FormHelperText>
                                </FormControl>
                            </Stack>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </PageBase>
    )
}