
import { Coordinates } from "./helpers"
import { Compartment } from "./compartment";

class Flow  {
    constructor(id, coef, x, y) {
        this.x_ = x;
        this.y_ = y;
      this.from_ = null; // -> const Compartment*
      this.to_coefs_ = new Map();
      this.coef_ = coef;
      this.id_ = id;
      this.interpolar_ = null;
      this.it_population_ = 0;
    }
    SetFromCompartment(from) {
      this.from_ = from;
    }
    SetToCompartment(from, coef = 1) {
      this.to_coefs_.set(from, coef);
    }
    SetInerpolar(from, coef = 1) {
      this.interpolar_ = { interpolar_by: from, interpolar_coef_: coef }; // induction
    }
    DeleteInterpolar() {
      if (this.interpolar_) {
        delete this.interpolar_;
      }
    }
    UpdateToComaprtmentCoef(to, coef) {
      if (this.to_coefs_.has(to)) {
        this.to_coefs_.set(to, coef);
      }
    }
    DeleteToCompartment(to) {
      if (this.to_coefs_.has(to)) {
        this.to_coefs_.delete(to);
      }
    }
    DeleteFromCompartment(from) {
      delete this.from_;
    }
    GetId() {
      return this.id_;
    }
    GetCoef() {
      return this.coef_;
    }
    GetFromComp() {
      return this.from_;
    }
    GetToComps() {
      return this.to_coefs_;
    }
    SetItPopulation(dif_population){
      this.it_population_ = dif_population;
    }
    GetItPopulation(){
      return this.it_population_;
    }

    toJson(){

      const to_comps = {};
      this.to_coefs_.forEach((coef, comp) => {
        to_comps[comp.name_] = coef;
      })
      return JSON.stringify({
        from: this.from_.name_,
        to: to_comps,
        coef: this.coef_,
      });
    }
  }

  export {Flow};