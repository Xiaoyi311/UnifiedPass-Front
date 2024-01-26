import { Button, Card, CardActions, CardContent, Divider, FormControl, FormLabel, Grid, Input, LinearProgress, Typography } from "@mui/joy";
import PageBase from "../components/PageBase";
import { Settings, PermIdentity, Key } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function Setting() {
    const [info, setInfo] = useState({
        username: "",
        password_old: "",
        password_new: ""
    });

    useEffect(() => {
        if (info.username === "") {
            fetch("/api/auth/info").then((data) => {
                data.text().then((text) => {
                    const json = JSON.parse(text);
                    if (json.status === 200) {
                        setInfo({
                            username: json.data.username,
                            password_old: "",
                            password_new: ""
                        });
                    }
                });
            });
        }
    })

    async function updateInfo(e: any){
        e.preventDefault();

        const res = await fetch("/api/auth/setInfo", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(res.status === 204){
            alert("更新个人信息成功!")
        }else{
            alert("更新个人信息失败! 请检查用户名与密码是否合法, 如果输入旧密码，旧密码是否正确")
        }
    }

    return (
        <PageBase selected="用户设置">
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
                            用户信息设置
                        </Typography>
                        <Divider inset="none" />
                        <form onSubmit={updateInfo}>
                            <CardContent
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                    gap: 1.5,
                                }}
                            >
                                <FormControl sx={{ gridColumn: '1/-1' }} required>
                                    <FormLabel>用户名</FormLabel>
                                    <Input name="username" endDecorator={<PermIdentity />} onChange={(e) => setInfo({
                                        username: e.target.value,
                                        password_old: info.password_old,
                                        password_new: info.password_new
                                    })} value={info.username} />
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1' }}>
                                    <FormLabel>旧密码</FormLabel>
                                    <Input placeholder="留空则不更新密码" type="password" name="password_old" endDecorator={<Key />} onChange={(e) => setInfo({
                                        username: info.username,
                                        password_old: e.target.value,
                                        password_new: info.password_new
                                    })} value={info.password_old} />
                                </FormControl>
                                <FormControl sx={{ gridColumn: '1/-1', '--hue': Math.min(info.password_new.length * 10, 120) }}>
                                    <FormLabel>新密码</FormLabel>
                                    <Input type="password" name="password_name" endDecorator={<Key />} onChange={(e) => setInfo({
                                        username: info.username,
                                        password_old: info.password_old,
                                        password_new: e.target.value
                                    })} value={info.password_new} />
                                    <LinearProgress
                                        determinate
                                        size="sm"
                                        value={Math.min((info.password_new.length * 100) / 12, 100)}
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
                                        {info.password_new.length < 3 && '太弱'}
                                        {info.password_new.length >= 3 && info.password_new.length < 6 && '弱'}
                                        {info.password_new.length >= 6 && info.password_new.length < 10 && '强'}
                                        {info.password_new.length >= 10 && '很强'}
                                    </Typography>
                                </FormControl>
                                <CardActions sx={{ gridColumn: '1/-1' }}>
                                    <Button disabled={info.username === ""} type="submit" variant="solid" color="primary">
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