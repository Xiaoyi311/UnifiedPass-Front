import { Box, Typography } from "@mui/joy";
import PageBase from "../components/PageBase";

export default function OverView() {
    return (
        <PageBase selected="仪表盘">
            <Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%">
                <Typography level="h3">Hmm, 这里还没有内容哦...</Typography>
            </Box>
        </PageBase>
    )
}