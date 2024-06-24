
import React from 'react';
import ResultRenderer from './results/ResultRender';
import "./tabs/style/ResultTabStyle.css"
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import LocalStorage from './handlers/LocalStorage';

function ResultsTab({ e_graph }) {

  const ls = new LocalStorage;
  const edge_node_graph = e_graph.toNodeEdgeGraph();
  const [img, setImageOfResults] = React.useState(null);

  const SavePictureFile = () => {
    var a = document.createElement('a');
    // console.log(img)
    a.href = img;
    const current_file_name = ls.GetPropFrom(".current_file")
    a.download = JSON.parse(current_file_name).name +  '_results.png';

    // Trigger the download
    a.click();
  }

  const RenderDownlodadImage = () => {
    return (<><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-download" viewBox="0 0 16 16">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
    </svg></>)
  }

  const RenderRefreshImage = () => {
    return (<><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
    </svg></>)
  }

  const RenderRates = () => {


    const comps = [];
    e_graph.GetComps().forEach((comp, id) => {
      comps.push({name: comp.GetName(), pop: comp.GetPopulation()});
    })
    const rates = []
    let total_population = 0;
    comps.forEach(data => {
      total_population += data.pop;
      const flow = e_graph.FindFlowByToComp(e_graph.getCompartmentByName(data.name));
      if(flow){
        rates.push({name: data.name, from: flow.GetFromComp().GetName(), coef: flow.GetCoef(), coef_name: flow.coef_name_});
      }
    })
    return(
      <>
        <div className='param-box'>
            Популяция
            <div></div>
            <Latex>$n$</Latex>: {total_population}
          </div>
        {rates.map(data => {
          return (<>
          <div className='param-box'>
            Вероятность перехода из <b>{data.from}</b> в <b>{data.name}</b>
            <div></div>
            {/* TODO: проверка на индуцированность {data.coef}*/}
            <Latex output="mathml">${data.coef_name}*p_{'{'} {data.from.slice(0,1).toLowerCase()}{data.name.slice(0,1).toLowerCase()} {'}'}$:  </Latex>
          </div>
          </>) 
        })}
      </>
    )
  }

  const RenderParametersContent = () => {
    return(
      <>
        <div className='parameters'>
          <div className='param-box'>
            Время (дни)
            <div></div>
            <Latex>$t_m$: 100</Latex>
          </div>
          <RenderRates/>
        </div>
      </>
    )
  }

  const RenderDev = () => {
    return (
      <>
        <p>
          {
            Array.from({ length: edge_node_graph.nodes.length }, (_, index) => {
              return (
                <>
                  <div className='node'>
                    Compartment: {'{'}
                    id: {edge_node_graph.nodes[index]?.id_}
                    ,name: {edge_node_graph.nodes[index]?.name_}
                    ,pop.: {edge_node_graph.nodes[index]?.population_}
                    ,x: {edge_node_graph.nodes[index]?.x_}
                    ,y: {edge_node_graph.nodes[index]?.y_}
                    {'}'}
                  </div>
                </>
              )
            })
          }
          {
            Array.from({ length: edge_node_graph.edges.length }, (_, index) => {
              return (
                <>
                  <div className='flow'>
                    Flow: {'{'}{edge_node_graph.edges[index].v?.name_ || 'null'} {'->'} {edge_node_graph.edges[index].w?.name_ || 'null'}{'}'}
                  </div>
                </>
              )
            })
          }
        </p>
      </>
    )
  }

  return (
    <div className="results-workspace">
      <div className='header'>
        <div className='page-text'>
          <h4>Результаты</h4>
        </div>
        <div className='buttons'>
          <button className='refresh'>{RenderRefreshImage()} Обновить</button>
          <button className='export' onClick={() => {SavePictureFile()}}>{RenderDownlodadImage()} Скачать</button>
        </div>
      </div>

      <div className='content'>
        <div className='parameters-content'>
          <RenderParametersContent/>
        </div>
        <div className='image-content'>
          <ResultRenderer e_graph={e_graph} setImageOfResults={setImageOfResults}/>
        </div>
      </div>
      {false && <RenderDev/>}
    </div>
  );
};

export default ResultsTab;
