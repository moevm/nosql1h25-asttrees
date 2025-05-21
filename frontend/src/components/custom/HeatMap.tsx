import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import {SVGRenderer} from 'echarts/renderers';
import type { EChartsOption } from 'echarts';


echarts.use([
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    HeatmapChart,
    SVGRenderer,
]);

interface HeatmapProps {
    data: {
        xValue: string;
        yValue: string;
        count: number;
    }[];
}

const HeatMap: React.FC<HeatmapProps> = ({ data }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current || !data.length) return;

        const chart = echarts.init(chartRef.current, null, {renderer: "svg"});

        const xAxisData = [...new Set(data.map(item => item.xValue))];
        const yAxisData = [...new Set(data.map(item => item.yValue))];

        const formattedData = data.map(item => [
            xAxisData.indexOf(item.xValue),
            yAxisData.indexOf(item.yValue),
            item.count,
        ]);

        const option: EChartsOption = {
            tooltip: { position: 'top' },
            grid: {
                height: '50%',
                top: '10%',
                left: 120,
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                splitArea: { show: true },
            },
            yAxis: {
                type: 'category',
                data: yAxisData,
                splitArea: { show: true },
                axisLabel: {
                    overflow: 'break', // или truncate/ellipsis
                    width: 100,
                },
            },
            visualMap: {
                min: 0,
                max: Math.max(...data.map(d => d.count)),
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
            },
            series: [
                {
                    name: 'Heatmap',
                    type: 'heatmap',
                    data: formattedData,
                    label: { show: true },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };

        chart.setOption(option);
        const resize = () => chart.resize();
        window.addEventListener('resize', resize);

        chart.resize()

        return () => {
            chart.dispose();
            window.removeEventListener('resize', resize);
        };
    }, [data]);

    return <div ref={chartRef} style={{ marginLeft: "10px",  width: '100%', height: '600px', display: "inherit" }} />;
};

export default HeatMap;