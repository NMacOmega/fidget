import { writable, get, derived } from "svelte/store";
import { Color, colorConvert } from "$lib/colorFunctions";
import { selectedUUID, getObjectWithMaterial } from "./threeJSObjectStores";

type MaterialOption = {
	color: Color,
	metalness: number,
	glossiness: number,
	opacity: number
}
const currentMaterialOption = (()=>{
	const {subscribe: metalness, set:setMetalness} = writable(0);
	const {subscribe: roughness, set:setRoughness} = writable(0);
	const {subscribe: opacity, set:setOpacity} = writable(0);
	const {subscribe: color, set:setColor} = writable('000000');
	return {metalness, setMetalness, roughness, setRoughness, opacity, setOpacity, color, setColor};
})();

export const currentMaterial = {
	metalness: currentMaterialOption.metalness,
	roughness: currentMaterialOption.roughness,
	opacity: currentMaterialOption.opacity,
	color: currentMaterialOption.color
};


export const currentMaterialMetalness = {subscribe: currentMaterialOption.metalness};
export const currentMaterialRoughness = {subscribe: currentMaterialOption.roughness};
export const currentMaterialOpacity = {subscribe: currentMaterialOption.opacity};
export const currentMaterialColor = {subscribe: currentMaterialOption.color};

export const updateCurrentMaterial = (UUID:string)=>{
	const currentOptions = (get(materialsOptionsStore)[UUID]);
	const currentOption = currentOptions.options[currentOptions.activeOption]; 
	currentMaterialOption.setColor(currentOption.color);
	currentMaterialOption.setMetalness(currentOption.metalness);
	currentMaterialOption.setRoughness(currentOption.roughness);
	currentMaterialOption.setOpacity(currentOption.opacity);
}
//To be run only once just after first Highlight operation in threeJS, so presentation variables are accurate
export function initializeCurrentMaterialOptions(){
	const initialOptions = get(currentMaterialOptions);
	const initialOption = initialOptions.options[initialOptions.activeOption];
	currentMaterialOption.setColor(initialOption.color);
	currentMaterialOption.setMetalness(initialOption.metalness);
	currentMaterialOption.setRoughness(initialOption.roughness);
	currentMaterialOption.setOpacity(initialOption.opacity);
}


export const materialsOptionsStore = (()=>{	
	const materials = writable({});
	return {subscribe: materials.subscribe, set:materials.set}
})(); 
export const currentMaterialOptions = (()=>{
	const {subscribe} = derived(selectedUUID, (UUID)=>(get(materialsOptionsStore))[UUID]);

	const updateChoice = (i)=> get(materialsOptionsStore)[get(selectedUUID)].activeOption = i;
	const updateOption = (i = -1, params) =>{
		if(i <1 || i > 3) return;//option 0 is default and should not be changed
		const material = get(materialsOptionsStore)[get(selectedUUID)].options[i];
		const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
		if(!objectWithMaterial) return;
		
		const {color='none', metalness=-1, roughness=-1, opacity=-1} = params;
		let paramsToApply = {};
		if(color && color !=='none') {
			material.color = color;
			paramsToApply.color = color;
			currentMaterialOption.setColor(color);
		}
		if(metalness > -1) {
			material.metalness = metalness;
			paramsToApply.metalness = metalness;
			currentMaterialOption.setMetalness(metalness);
		}
		if(roughness > -1) {
			material.roughness = roughness;
			paramsToApply.roughness = roughness;
			currentMaterialOption.setRoughness(roughness);
		}
		if(opacity > -1) {
			material.opacity = opacity;
			paramsToApply.opacity = opacity;
			currentMaterialOption.setOpacity(opacity);
			
		}
		applyPropertiesToObject(objectWithMaterial, paramsToApply);
		}
		const isValidColor = (c='none')=>colorConvert.HEX.isValid(c).success;
		const isValidMetalness = (m=-1)=> m >=0 && m <= 100;
		const isValidRoughness = (r=-1)=> r >=0 && r <= 100; 
		const isValidOpacity = (o=-1)=> o >=0 && o <= 100; 


		const updateColor = (i= -1, color="none")=>{
			if(!isValidColor(color) || i < 0) return;
			updateOption(i, {color});

		};
		const updateMetalness = (i=-1, metalness=-1)=>{
			if(!isValidMetalness(metalness)|| i < 0) return;
			updateOption(i, {metalness});
		};
		const updateRoughness = (i=-1, roughness=-1)=>{
			if(!isValidMetalness(roughness)|| i < 0) return;
			updateOption(i, {roughness});

		};
		const updateOpacity = (i=-1, opacity=-1)=>{
			if(!isValidMetalness(opacity)|| i < 0) return;
			updateOption(i, {opacity});
		};
		const updateAll = (i=-1, color='none', metalness=-1, roughness=-1, opacity=-1)=>{
			if(!isValidColor(color)
				|| !isValidMetalness(metalness)
			|| !isValidRoughness(roughness)
			|| !isValidOpacity(opacity)
			|| i < 0) return;
			updateOption(i, {color, metalness, roughness, opacity});

		};
		const applyOption = (i=-1)=>{
			if(i <= -1 || 1 > 3) return;
			let material = get(materialsOptionsStore)[get(selectedUUID)];
			let option = material.options[i];
			const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
			if(!objectWithMaterial) return;
			applyPropertiesToObject(objectWithMaterial, {...option});
			currentMaterialOption.setColor(option.color);
			currentMaterialOption.setMetalness(option.metalness);
			currentMaterialOption.setRoughness(option.roughness);	
			currentMaterialOption.setOpacity(option.opacity);	
		}

		const applyPropertiesToObject = (objectWithMaterial, params)=>{
			let {color = 'none', metalness = -1, roughness = -1, opacity = -1} = params;
			if(color != 'none') {
				objectWithMaterial.material.color.set(`#${color}`);
			}
			if(metalness > -1){
				
				if(metalness === 0) metalness += 0.0001;
				if(metalness === 100) metalness -= 0.0001;
				objectWithMaterial.material.metalness = metalness / 100;
			}
			if(roughness > -1){
				
				if(roughness === 0) roughness += 0.0001;
				if(roughness === 100) roughness -= 0.0001;
				objectWithMaterial.material.roughness = roughness / 100;
			}
			if(opacity > -1){
				
				if(opacity === 0) opacity += 0.0001;
				if(opacity === 100) opacity -= 0.0001;
				objectWithMaterial.material.opacity = opacity / 100;
			}

		}
	return {subscribe, updateChoice, applyOption, updateColor, updateMetalness, updateRoughness, updateOpacity, updateAll}
})();


interface PaletteOption {
	color: string,
	metalness: number,
	roughness: number,
	opacity: number,
};
export const paletteStore = (()=>{
	const initialOptions = [
		{color: 'ff0000', metalness:90, roughness:60, opacity:80},
		{color: '00ff00', metalness:20, roughness:20, opacity:40},
		{color: '0000ff', metalness:60, roughness:40, opacity:100}
	];
	const palette = writable<PaletteOption[]>([...initialOptions]);

	interface PaletteAddResult{
		wasAdded: boolean;
		duplicateIndex?: number;
	}
		const add = (newOption: PaletteOption)=>{

			const current = get(palette);
			const [isDuplicate, duplicateInd] = (()=>{
				let ind = 0;
				for(const option of current)
				{
					if(option.color === newOption.color 
						&& option.metalness === newOption.metalness 
						&& option.roughness === newOption.roughness 
						&& option.opacity === newOption.opacity)
						return [true, ind];
					else ind ++;
				}
				return [false];
			})();

			if(isDuplicate)
				return {wasAdded:false, duplicateIndex: duplicateInd} as PaletteAddResult

			else{
				palette.update((current)=>[...current, newOption]);
				return {wasAdded: true} as PaletteAddResult;
			}
			};

	const remove = (index:number)=>palette.update((current)=>[...current.filter((_, i)=> i!==index)])
	return {subscribe:palette.subscribe, add, remove};  
})();




///Old stuff below we should eventually be able to delete

export const currentMaterialChoice = writable<number>(0);

export const initialMaterialState =(initialColorHex, initialMetalness, initialRoughness, initialOpacity)=>{
 

	const initialColor = new Color(initialColorHex);
	const validInitialColor = initialColor.isValidColor ? initialColor : new Color ('#000000');
	const initialState = {
		default: {
			color: validInitialColor,
			metalness: initialMetalness,
			roughness: initialRoughness,
			opacity: initialOpacity
		},
		options: []
	};
	const initialOptions = [
		{color: new Color('#ff0000'), metalness:0.9, roughness:0.6, opacity:0.8},
		{color: new Color('#00ff00'), metalness:0.2, roughness:0.2, opacity:0.4},
		{color: new Color('#0000ff'), metalness:0.6, roughness:0.4, opacity:1}
	];
	initialState.options.push(initialState.default);
	initialState.options.push(initialOptions[0]);
	initialState.options.push(initialOptions[1]);
	initialState.options.push(initialOptions[2]);

	return initialState;
};


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



