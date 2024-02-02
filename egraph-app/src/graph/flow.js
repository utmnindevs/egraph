
import { Coordinates } from "./helpers"

class Flow  {
    constructor(id, coef, x, y) {
        this.x_ = x;
        this.y_ = y;
      this.from_coefs_ = new Map();
      this.to_coefs_ = new Map();
      this.coef_ = coef;
      this.id_ = id;
      this.interpolar_ = null;
    }
    SetFromCompartment(from, coef = 1) {
      this.from_coefs_.set(from, coef);
    }
    SetToCompartment(from, coef = 1) {
      this.to_coefs_.set(from, coef);
    }
    SetInerpolar(from, coef = 1) {
      this.interpolar_ = { interpolar_by: from, interpolar_coef_: coef };
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
    UpdateFromComaprtmentCoef(from, coef) {
      if (this.from_coefs_.has(from)) {
        this.from_coefs_.set(from, coef);
      }
    }
    DeleteToCompartment(to) {
      if (this.to_coefs_.has(to)) {
        this.to_coefs_.delete(to);
      }
    }
    DeleteFromCompartment(from) {
      if (this.from_coefs_.has(from)) {
        this.from_coefs_.delete(from);
      }
    }
    GetId() {
      return this.id_;
    }
    GetCoef() {
      return this.coef_;
    }
    GetFromComps() {
      return this.from_coefs_;
    }
    GetToComps() {
      return this.to_coefs_;
    }
  }

  export {Flow};