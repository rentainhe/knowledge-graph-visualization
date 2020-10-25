import Home from "~/views/Home";
import TextUpload from "~/views/TextUpload";
import Check_1 from "~/views/Check_1";
import Check_2 from "~/views/Check_2";
import Knowledge_tree from "~/views/Knowledge_tree";
import Newgraph from "~/views/Newgraph";
import newTreeGraph from "~/views/newTreeGraph";
import excel_upload from "~/views/excel_upload";
export const routes = [
    {
        path:'/Home',
        component:Newgraph
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
    },
    {
        path: '/Knowledge_tree',
        component: Knowledge_tree
    },
    {
        path: '/',
        component: Newgraph
    },
    {
        path: '/newTreeGraph',
        component: newTreeGraph
    },
    {
        path: '/excel_upload',
        component: excel_upload
    },
]