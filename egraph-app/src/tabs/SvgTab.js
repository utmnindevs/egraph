import React from 'react';
import { svgConverterFunction } from '../Svgconverter.ts';
import "./style/SvgTabStyle.css"
var dagre = require("@xdashduck/dagre-tlayering");

function SvgTab({ e_graph }) {

    const RenderDownlodadImage = () => {
        return (<><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
        </svg></>)
    }

    const RenderSvgImage = (e_graph) => {
        return svgConverterFunction(e_graph.getDagreGraph({ label_w: 100, node_w: 50, node_h: 50 }));
    }

    return (

        <>
            <div className='svg-body'>
                <div className='header'>
                    <div className='page-text'>
                        <h4>Изображение</h4>
                    </div>
                    <div className='setting_buttons'>
                        <button className='image settings'>Настройка всего изображения</button>
                        <button className='node settings actived'>Настройка узлов</button>
                        <button className='edge settings'>Настройка ребер</button>
                        <button className='export'>{RenderDownlodadImage()} Скачать</button>
                    </div>
                </div>

                <div className='settings-content'>
                    <div className='content-box'>
                        <a>Шрифт</a>
                        <select class="form-select" aria-label="Default select example">
                            <option selected>Roboto</option>
                            <option value="1">One</option>
                        </select>
                    </div>
                    <div className='content-box'>
                        <a>Размер шрифта</a>
                        <input type="number" class="form-control" defaultValue={10} style={{width:130}}/>
                    </div>
                    <div className='content-box'>
                        <a>Ширина</a>
                        <input type="number" class="form-control" defaultValue={50} style={{width:60}}/>
                    </div>
                    <div className='content-box'>
                        <a>Высота</a>
                        <input type="number" class="form-control" defaultValue={50} style={{width:60}}/>
                    </div>
                </div>

                <div className="image-workspace">
                    <div className='image' dangerouslySetInnerHTML={{ __html: RenderSvgImage(e_graph) }} />
                </div>
            </div>


        </>
    );
};

export default SvgTab;
