import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import {SVGRenderer} from 'echarts/renderers';
import {type EChartsOption, type TooltipComponentFormatterCallbackParams} from 'echarts';
import dayjs from "dayjs";


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

        let xAxisDataOriginal = [...new Set(data.map(item => item.xValue))];
        let yAxisDataOriginal = [...new Set(data.map(item => item.yValue))];

        const sortAxisData = (axisValues: (any)[]): (any)[] => {
            if (!axisValues || axisValues.length === 0) return [];

            const sortedValues = [...axisValues];

            const allNumeric = sortedValues.every(val =>
                val !== null && val !== undefined &&
                !isNaN(parseFloat(val)) &&
                isFinite(Number(val))
            );

            if (allNumeric) {
                return sortedValues.sort((a, b) => Number(a!) - Number(b!));
            }

            const allDates = sortedValues.every(val =>
                val !== null && val !== undefined &&
                dayjs(val).isValid()
            );

            if (allDates) {
                return sortedValues.sort((a, b) => dayjs(a!).valueOf() - dayjs(b!).valueOf());
            }

            return sortedValues.sort((a, b) => {
                if (a === null || a === undefined) {
                    if (b === null || b === undefined) {
                        return 0;
                    }
                    return -1;
                }
                if (b === null || b === undefined) {
                    return 1;
                }
                console.info({a, b})
                return a.localeCompare(b);
            });
        };

        const xAxisData = sortAxisData(xAxisDataOriginal);
        const yAxisData = sortAxisData(yAxisDataOriginal);

        const formattedData = data.map(item => {
            const xIndex = xAxisData.indexOf(item.xValue);
            const yIndex = yAxisData.indexOf(item.yValue);
            return [xIndex, yIndex, item.count];
        }).filter(item => item !== null) as [number, number, number][];

        const option: EChartsOption = {
            tooltip: {
                position: 'top',
                formatter: (params: TooltipComponentFormatterCallbackParams) => {
                    const param = Array.isArray(params) ? params[0] : params;
                    const xIndex = param.value[0] as number;
                    const yIndex = param.value[1] as number;
                    const count = param.value[2] as number;
                    const xValueName = xAxisData[xIndex];
                    const yValueName = yAxisData[yIndex];
                    let tooltipHtml = `${param.marker || ''}`;
                    if (param.seriesName) {
                        tooltipHtml += `${echarts.format.encodeHTML(param.seriesName)}<br/>`;
                    }
                    tooltipHtml += `X: ${echarts.format.encodeHTML(xValueName)}<br/>`;
                    tooltipHtml += `Y: ${echarts.format.encodeHTML(yValueName)}<br/>`;
                    tooltipHtml += `Count: ${echarts.format.encodeHTML(String(count))}`;

                    return tooltipHtml;
                }
            },
            grid: {
                height: '50%',
                top: '10%',
                left: 120,
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                splitArea: { show: true },
                axisLabel: {
                    overflow: 'break', // или truncate/ellipsis
                    width: 100,
                },
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
                    name: 'Количество',
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
