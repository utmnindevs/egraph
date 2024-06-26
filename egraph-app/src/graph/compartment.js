import { Coordinates } from "./helpers"

import { generate_uuid_v4 } from '../graph/helpers';


class Compartment extends Coordinates {
    /**
     * 
     * @param {string} id - идентификатор узла
     * @param {} comp_config - информация о компартменте: {name: , population: }
     */
    constructor(id, comp_config) {
      super(comp_config.x, comp_config.y);
      this.id_ = id;

      this.name_ = comp_config.name;
      this.population_ = comp_config.population;
      this.is_started_ = false;
    }
    GetPopulation() {
      return this.population_;
    }
    SetPopulation(new_population) {
      this.population_ = new_population;
    }
    SetPopulationFromDiff(diff_population){
      this.population_ += diff_population;
    }
    SetIsStarted(isStarted){
      this.is_started_ = isStarted;
    }
    GetName() {
      return this.name_;
    }
    GetId() {
      return this.id_;
    }
    GetAttr(){
      return this.name_.slice(0,2);
    }
    UpdateCompartment(name = "", population = null) {
      this.population_ = population ? population : this.population_;
      this.name_ = !(name === "") ? name : this.name_;
      return this;
    }

    // iteration population - +/-
    // method: ApplyIterationPopulation

    toString(){
      let stringData = {
        id: this.id_,
        name: this.name_,
        attr: this.name_.slice(0,1),
        population: this.population_,
        position: {
          x: this.x_,
          y: this.y_
        } 
      } 
      if(this.is_started_){stringData.is_started = this.is_started_}
      return stringData;
    }
  }


  export {Compartment};