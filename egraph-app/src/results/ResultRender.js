import * as React from 'react';
import { Component } from 'react';
import {
    Chart,
    ChartData,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions, ChartItem
} from 'chart.js';
import { Line } from "react-chartjs-2"
import "chart.js/auto";
import { EGraph } from '../graph/graph';
import { Compartment } from '../graph/compartment';

import "./ResultRender.css"

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

const ResultRenderer = ({ e_graph, setImageOfResults }) => {

    let [chart, setChart] = React.useState(null);
    let [ctx, setCtx] = React.useState();
    const [chart_data, SetChartData] = React.useState({ labels: [], yLabels: [], xLabels: [], datasets: [] });

    const time_ = 250;

    const GetResultByDay = (days) => {
        e_graph.onCompute(e_graph.getStartedCompartment(), days);
        return e_graph.result_json || [];
    }
    const GetFeatures = () => {
        let result = [];
        e_graph.id_to_comp_?.forEach((comp, id) => {
            result.push(comp.GetName());
        });;
        return result;
    }

    const GetDataSet = (name, result) => {
        const result_ = { label: name, data: result.map(data => data[name]), pointRadius: 0, borderWidth: 2 };
        return result_;
    }

    const RenderLabel = React.useCallback(() => {
        const result_egraph = GetResultByDay(time_);
        SetChartData({
            labels: result_egraph?.map((data) => data.label),
            datasets: GetFeatures().map(data => GetDataSet(data, result_egraph)),
        })
    }, [SetChartData])

    const SetChartShared = React.useCallback(() => {
        const result_egraph = GetResultByDay(time_);
        const charted = {
            labels: result_egraph?.map((data) => data.label),
            datasets: GetFeatures().map(data => GetDataSet(data, result_egraph)),
        };
        if (ctx != null) {
            chart?.destroy();
            chart = new Chart(ctx,{
                    type: "line",
                    data: charted,
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Кол-во людей'
                                },
                                beginAtZero: true,
                            },
                            x:{
                                min: 0,
                                max: time_,
                                title: {
                                    display: true,
                                    text: 'Время (дни)'
                                },
                            },
                        },
                        animation: {
                            onComplete: function () {
                                if(chart){
                                    setImageOfResults(ctx.toDataURL());
                                }
                            },
                        },
                        plugins: {
                            customCanvasBackgroundColor: {
                              color: 'white',
                            },
                            legend:{
                                display: true,
                            }
                          }
                    },
                    plugins: [plugin],
                });
        }
    }, [RenderLabel, setImageOfResults])

    React.useEffect(() => {
        ctx = document.getElementById("result-canvas-id1");
        SetChartShared();
        return () => {
            chart?.destroy();
        }

    }, [SetChartShared, RenderLabel])

    return (
        <>
            <div >
                <canvas id="result-canvas-id1" className='result-canvas'/>
            </div>
        </>
    );
}

export default ResultRenderer;