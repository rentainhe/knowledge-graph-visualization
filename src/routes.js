import Home from "~/views/Home";
import TextUpload from "~/views/TextUpload";
import Check_1 from "~/views/Check_1";
import Check_2 from "~/views/Check_2";
import Knowledge_tree from "~/views/Knowledge_tree";
import Newgraph from "~/views/Newgraph";
import newTreeGraph from "~/views/newTreeGraph";
import excel_upload from "~/views/excel_upload";
import init_database from "~/views/initDatabase";
import uploadInitData from "~/views/uploadInitData";
export const routes = [
    {
        path:'/Home',
        component:Newgraph
    },
    {
        path: '/Check_1',
        component: Check_1
    },
    {
        path: '/Check_2',
        component: Check_2
    },
    {
        path: '/Newgraph',
        component: Newgraph
    },
    {
        path: '/excel_upload',
        component: excel_upload
    },
    {
        path: '/',
        component: init_database
    },
    {
        path: '/uploadInitData',
        component: uploadInitData
    },
]