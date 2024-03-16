import { writable, get } from "svelte/store";
import { Color } from "$lib/colorFunctions";

type MaterialOption = {
	color: Color,
	metalness: number,
	glossiness: number,
	opacity: number
}

export const materialOptionsList = (function(){
	const defaultOptions: MaterialOption[] = [
		{ color: new Color('ff0000'), metalness: 0.7, glossiness: 0.2, opacity: 1 },
		{ color: new Color('ee66ee'), metalness: 1, glossiness: 0, opacity: 1 },
		{ color: new Color('0000ff'), metalness: 0, glossiness: 0.7, opacity: 1 }
	];

	const list = writable<MaterialOption[]>([...defaultOptions]);


	const add = (newOption: MaterialOption)=>list.update((current)=>[...current, newOption]);

	const remove = (index=-1, option={ColorObject: undefined, metalness: undefined, glossiness: undefined})=>{

		if(index >= 0)
			{
				list.update((current)=>[...current.filter((_, i)=> i!==index)])
			};

		if(!option || option ===null 
			|| !option.color 
			|| !option.metalness 
			|| !option.glossiness) return;
		{
		list.update((current)=>
		[...current.filter(
			(o)=>o.color!==option.color 
			&& o.metalness!==option.metalness 
			&& o.glossiness !== option.glossiness)])
		};
	}

	const update = (index=-1, {color=undefined, metalness=undefined, glossiness=undefined, opacity=undefined})=>{
		if(index < 0 || index >= get(list).length
		||color=== undefined
		||metalness===undefined
		||glossiness===undefined
		||opacity===undefined)
		{
			console.error('bad color update to materials list');
			return;
		}
	list.update((current)=>{
		current[index] = {color, metalness, glossiness, opacity};
		return [...current];
	})	
}

	return {subscribe:list.subscribe, add, remove, update};
})();


// export const isValidMaterialOption = (params:{color:HEXColor, metalness: number, glossiness: number, opacity: number})=>{
// 	const {color, metalness, glossiness, opacity} = params;
// 	if(!preprocessHex(color)) return false;
// 	const isNumberInRange = (n:number, max:number, min:number)=> n >= min && n <= max;
// 	if(!isNumberInRange(metalness, 0, 1)) return false;
// 	if(!isNumberInRange(glossiness, 0, 1)) return false;
// 	if(!isNumberInRange(opacity, 0, 1)) return false;
// 	return true;
// }
