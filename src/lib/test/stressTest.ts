import { convert } from "$lib/colorFunctions";

const testsPerMode = 100;
const HSL = {
    h: {max: 360, min: 0, tags: ['h', 'hue']},
    s: {max: 100, min: 0, tags: ['s', 'sat', 'saturation']},
    l: {max: 100, min: 0, tags: ['l', 'luminosity', 'lum', 'light', 'lightness']}
};
const HSV = {
    h: {max: 360, min: 0, tags: ['h', 'hue']},
    s: {max: 100, min: 0, tags: ['s', 'sat', 'saturation']},
    v: {max: 100, min: 0, tags: ['v', 'value', 'val']}

};
const HEX = {max:16777218, min:0};
const RGB = {
    r: {max: 255, min: 0, tags: ['r', 'red']},
    g: {max: 255, min: 0, tags: ['g', 'green']},
    b: {max: 255, min: 0, tags: ['b', 'blue']}
};


const generateRands = (max=0, min=0, amt=1)=>{
    const res = [];
    for(let i = amt; i>0; i--){
        res.push(Math.random() * (max - min) + min)
    }
    return res;
}

export function buildTestsByValues(){
    
    //buld HSLTests
    const hslTestsArr = [];
    //hue tests
    //sat tests
    //lum tests

    //build HSVTests
    //hue tests
    //sat tests
    //val tests

    //build HEXTests

    
    //build RGBTests
    //red tests
    //green tests
    //blue tests








}