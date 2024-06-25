
import { Coordinates } from "./helpers"
import { Compartment } from "./compartment";

import { generate_uuid_v4 } from '../graph/helpers';

export class Induction {
  constructor(from, coef){
    this.from_ = from || null;
    this.coef_ = coef || null;
  }

  GetFrom(){return this.from_;}
  GetCoef(){return this.coef_;}
  SetFrom(from){this.from_ = from;}
  SetCoef(coef){this.coef_ = coef;}
}

class Flow  extends Coordinates{
  /**
   * 
   * @param {*} flow_config - Параметры потока: {from: comp, to: [[,], [,]], coef: ,induction: } 
   */
    constructor(id, flow_config) {
      super(flow_config.x, flow_config.y);
      
      this.id_ = id;
      this.from_ = flow_config.from || null; 
      this.to_coefs_ = flow_config.to != [] ? new Map(flow_config.to) : null;
      this.coef_ = flow_config.coef;
      this.coef_name_ = flow_config.coef_name || "\\gamma"
      this.induction_ = flow_config.induction || [];
      this.it_population_ = 0;
    }
    SetFromCompartment(from) {
      this.from_ = from;
    }
    SetToCompartment(from, coef = 1) {
      this.to_coefs_.set(from, coef);
    }
    SetInerpolar(from, coef = 1) {
      this.induction_ = new Induction(from, coef);
    }
    GetToCompartmentCoef(comp){
      if(this.to_coefs_.has(comp)){
        return this.to_coefs_.get(comp);
      }
      return 0;
    }
    Deleteinduction(induction) {
      let finded_induction = this.induction_.find(induction);
      if (finded_induction != -1) {
        this.induction_.splice(this.induction_.indexOf(finded_induction), 1);
      }
    }
    GetInductions(){
      return this.induction_;
    }
    AddInduction(induction){
      this.induction_.push(new Induction(induction.GetFrom(), induction.GetCoef()));
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
      const inductions = [];
      this.induction_.forEach((data) => {inductions.push({from: data.GetFrom(), coef:data.GetCoef()})})
      return {
        id: this.id_,
        from: this.from_?.name_ || null,
        to: to_comps,
        coef: this.coef_,
        coef_name: this.coef_name_,
        induction: inductions,
        position: {
          x: this.x_,
          y: this.y_,
        }
      };
    }
  }

  export {Flow};