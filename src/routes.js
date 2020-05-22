import Home from "~/views/Home";
import TextUpload from "~/views/TextUpload";
import Check from "~/views/Check";
export const routes = [
    {
        path:'/Home',
        component:Home
    },
    {
        path: '/TextUpload',
        component: TextUpload
    },
    {
        path: '/Check',
        component: Check
    }
]