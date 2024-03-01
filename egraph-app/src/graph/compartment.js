import { Coordinates } from "./helpers"


class Compartment extends Coordinates {
    constructor(name, id, population, another) {
      super();
      this.name_ = name;
      this.id_ = id;
      this.population_ = population;
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
    GetName() {
      return this.name_;
    }
    GetId() {
      return this.id_;
    }
    GetAttr(){
      return this.name_.slice(0,2);
    }
    UpdateCompartment(name = "", id = "", population = null) {
      this.population_ = population ? population : this.population_;
      this.name_ = name === "" ? name : this.name_;
      this.id_ = id === "" ? id : this.id_;
    }

    // iteration population - +/-
    // method: ApplyIterationPopulation

    toString(){
      return {
        id: this.id_,
        name: this.name_,
        attr: this.name_.slice(0,1),
        population: this.population_,
      };
    }
  }


  export {Compartment};