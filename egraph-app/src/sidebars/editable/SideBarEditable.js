import React from 'react';

import "./style/SideBarEditable.css"

function SideBarEditable({ node, setStateMenu, ...editable_props }) {

    const onButtonOkClick = () => {
        setStateMenu(null);
    }

    // TODO: решить баг с тем, что при выделении в не hover зоне то считает за клик, переклик или другие действия сразу закрывает правый сайдбар
    // TODO: добавить кнопку закрытия и режим редактирования в панели в виде кнопки, в котором есть возможность вызывать этот сайдбар

    return (
        <div class="side-bar-editable-body">
            <p class="header"> Редактирование {node.type === 'compartmentNode' ? "компартмента" : "потока"} </p>

            <div class="content">
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Название</span>
                    <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder={node.data.name}/>
                </div>
                <div class="input-group input-group-sm mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Популяция</span>
                    <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder={node.data.obj.population_}/>
                </div>
                <span>Стартовый</span>
                <p>Кол-во входных</p>
                {/* <p>Кол-во выходных</p> Сделать через кнопку "плюс" и "минус" с предупреждением что для минуса нужно отсоеденить поток  */}

            </div>


            <button class='button-39 footer' onClick={onButtonOkClick}>Принять</button>
        </div>
    )
}

export default SideBarEditable;