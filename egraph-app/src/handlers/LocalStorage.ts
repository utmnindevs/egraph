import React from 'react';


 
class LocalStorage{
    

    SavePropTo(key: string, value: string) : void {
        const existing_value = localStorage.getItem(key);
        if(existing_value === null){ localStorage.setItem(key, value); return; }
        else{localStorage.setItem(key, JSON.stringify({...JSON.parse(existing_value || ""), ...JSON.parse(value)}));}
    }
    GetPropFrom(key: string) : string | undefined {
        return localStorage.getItem(key) || undefined;
    }
}
 
export default LocalStorage;