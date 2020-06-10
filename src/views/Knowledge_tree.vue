<template>
    <div>
        <div class="header_text">知识图谱系统</div>
        <div class="container">
            <div class="left">
                <div id="myChart" :style="{width: '537px', height: '500px'}"></div>
            </div>

            <div class="right"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        mounted() {
            this.drawLine();
        },
        methods: {
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    calculable : false,
                    series : [
                        {
                            name:'树',
                            type:'tree',
                            symbolSize: [60,30],
                            edgeShape:'polyline',
                            symbol : 'roundRect',
                            orient: 'vertical',  // vertical horizontal
                            rootLocation: {x: 'center',y: 50}, // 根节点位置  {x: 100, y: 'center'}
                            nodePadding: 20,
                            itemStyle: {
                                normal: {
                                    color : 'rgba(128,0,0)', //节点的颜色在这里改
                                    label: {
                                        show: true,
                                        formatter: "{b}",
                                        color : "#fff"
                                    },
                                    lineStyle: {
                                        color: '#48b',
                                        shadowColor: '#000',
                                        shadowBlur: 3,
                                        shadowOffsetX: 3,
                                        shadowOffsetY: 5,
                                        curveness: 0.5,
                                        // type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true
                                    }
                                }
                            },

                            data: [
                                {
                                    name: '所有节点',
                                    value: 100,
                                    children: [
                                        {
                                            name: '俱乐部',
                                            value: 4,
                                            children: [

                                            ]
                                        },
                                        {
                                            name: '球员',
                                            value: 4,
                                            children: [{
                                                name: '前锋',
                                                value: 4
                                            },
                                                {
                                                    name: '后卫',
                                                    value: 4
                                                },
                                                {
                                                    name: '守门员',
                                                    value: 4
                                                }]
                                        },
                                        {
                                            name: '联赛',
                                            value: 1,
                                            children: [

                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
            }
        }
    }
</script>

<style>
    .header_text{
        font-family: "PingFang SC";
        font-size: 30px;
        letter-spacing: 6px;
        color: #ffffff;
        position: absolute;
        top: 0%;
        width: 100%;
        height: 6%;
        background-color: #15161F;
    }
    .container{
        position: absolute;
        top:6%;
        background-color: #15161F;
        width: 100%;
        height: 100%;
    }
    .container .left{
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
        background-color: #ff7f0e;
    }
    .container .right{
        position: relative;
        float: right;
        width: 50%;
        height: 100%;
        background-color: #1f77b4;
    }
</style>