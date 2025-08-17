export function toPixels(value:number, reference:number = window.innerWidth){
    return value / 100 * reference;
}

export function toPercentage(value:number, reference:number = window.innerWidth, mutate:(number:number)=>number = (value)=>value){
  
  const def = value / reference * 100;
  
  return mutate(def);
}