import { EGraph } from './graph';
import { generate_uuid_v4 } from './helpers';
import { Compartment } from './compartment';

/**
 * Класс описывающий логику тестов сущности графа. Проверяет корректность в штатном режиме, так например - добавление узла, компартмента и т.п.
 * по действиям пользователя. Тажке проверяет крайние случаи, например проверку на валидность введенных значений, поиск новых узлов и т.п.
 */
class GraphTest {
    e_graph_: EGraph

    constructor(e_graph?: EGraph){
        if(e_graph != undefined){
            this.e_graph_ = e_graph;
        }else{
            this.e_graph_ = new EGraph();
        }
    }

    private GenerateName(length: number) : string{
        let result: string = "";
        const upper_characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЯЁЖЗИЙКЛМНОПРСТ";
        const lower_characters: string = upper_characters.toLowerCase();
        let counter = 1;
        result += upper_characters.charAt(Math.floor(Math.random() * upper_characters.length));
        while (counter < length){
            result += lower_characters.charAt(Math.floor(Math.random() * lower_characters.length));
            counter += 1;
        }
        return result;
    }

    InitStages(stages_counts: number, name_lenght: number){
        let test_arr = new Array<number>(stages_counts);
        for(let item of test_arr){
            this.e_graph_.AddComp(generate_uuid_v4(), { name: this.GenerateName(name_lenght), population: 1, x: 10, y: 10});
        }
    }

    /**
     * Метод удаляет состояния, также возможна последующая проверка на потоки и что нигда нет этого состояния.
     * @param stages_counts кол-во удаляемых состояний
     */
    DeleteStages(stages_counts: number){
        let comps: Map<string, Compartment> = this.e_graph_.GetComps();
        const size_comps: number = comps.size;
        let counter = 0;
        comps.forEach((v: Compartment, k:string) => {
            if(counter < stages_counts && counter < size_comps){
                this.e_graph_.DeleteComp(v);
                counter +=1;
            }
        })
    }

    GetGraph() : EGraph {
        return this.e_graph_;
    }



}
 
export default GraphTest;