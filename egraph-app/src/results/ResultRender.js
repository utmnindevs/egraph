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



const ResultRenderer = (props) => {

    let [ctx, setCtx] = React.useState();
    let [chart, setChart] = React.useState(null);
    const chartRef = React.useRef(null);
    const [chart_data, SetChartData] = React.useState({labels: [], yLabels: [], xLabels: [], datasets: []});
    
    const time_= 100;

    const GetResultByDay = (days) => {
        props.e_graph.onCompute(props.e_graph.getStartedCompartment(), days);
        return props.e_graph.result_json || [];
    }
    const GetFeatures = () => {
        let result = [];
        props.e_graph.id_to_comp_?.forEach((comp, id) => {
            result.push(comp.GetName());
        });;
        return result;
    }

    const GetDataSet = (name, result) => {
        const result_ = {label: name, data: result.map(data => data[name]), pointRadius: 0, borderWidth: 2};
        return result_;
    }

    
    
    const RenderLabel = React.useCallback(() =>{
        const result_egraph = GetResultByDay(time_);
        SetChartData({
            labels: result_egraph?.map((data) => data.label),
            datasets: GetFeatures().map(data => GetDataSet(data, result_egraph)),
        })
        console.log("clicked")
    }, [SetChartData])

    const SetChartShared = React.useCallback(() => {
        RenderLabel();
        if(ctx != null){
            chart?.destroy();
            chart = new Chart(ctx, 
                {type: "line", 
                data: chart_data,
                options: {
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                }});
        }        
    }, [RenderLabel])

    React.useEffect(() => {
        ctx = document.getElementById("result-canvas-id1");
        SetChartShared();
        return () => {
            chart?.destroy();
        }
    }, [SetChartShared])
    
    return(
        <>
        <div >
            {/* <button onClick={() => {SetChartShared()}}>Click me</button> */}
            <canvas id="result-canvas-id1" className='result-canvas'/>
        </div>
        </>
    );
}

export default ResultRenderer;