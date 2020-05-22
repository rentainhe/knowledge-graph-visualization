import Home from "~/views/Home";
import TextUpload from "~/views/TextUpload";
import Check_1 from "~/views/Check_1";
import Check_2 from "~/views/Check_2";
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
        path: '/Check_1',
        component: Check_1
    },
    {
        path: '/Check_2',
        component: Check_2
    }
]