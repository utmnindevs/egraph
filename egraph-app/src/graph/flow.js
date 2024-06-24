
import { Coordinates } from "./helpers"
import { Compartment } from "./compartment";

import { generate_uuid_v4 } from '../graph/helpers';

class Flow  extends Coordinates{
  /**
   * 
   * @param {*} flow_config - Параметры потока: {from: comp, to: [[,], [,]], coef: ,interpolar: } 
   */
    constructor(id, flow_config) {
      super(flow_config.x, flow_config.y);
      
      this.id_ = id;
      this.from_ = flow_config.from || null; 
      this.to_coefs_ = flow_config.to != [] ? new Map(flow_config.to) : null;
      this.coef_ = flow_config.coef;
      this.coef_name_ = flow_config.coef_name || "\\gamma"
      this.interpolar_ = flow_config.interpolar != undefined ? flow_config.interpolar : null;
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
    GetToCompartmentCoef(comp){
      if(this.to_coefs_.has(comp)){
        return this.to_coefs_.get(comp);
      }
      return 0;
    }
    DeleteInterpolar() {
      if (this.interpolar_) {
        delete this.interpolar_;
      }
    }
    UpdateCoef(coef){
      this.coef_ = coef;
    }
    UpdateCoefName(coef){
      this.coef_name_ = coef
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
    GetCoefName(){
      return this.coef_name_
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

    toString(){
      const to_comps = [];
      this.to_coefs_.forEach((_coef, comp) => to_comps.push({
        name: comp.name_,
        coef: _coef
      }))
      return {
        id: this.id_,
        from: this.from_?.name_ || null,
        to: to_comps,
        coef: this.coef_,
        coef_name: this.coef_name_,
        position: {
          x: this.x_,
          y: this.y_,
        }
      };
    }
  }

  export {Flow};