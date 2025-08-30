export function toPixels(value:number, reference:number = window.innerWidth){
    return value / 100 * reference;
}

export function toPercentage(value:number, reference:number = window.innerWidth){
  return value / reference * 100;
}