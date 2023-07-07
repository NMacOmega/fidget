import { writable } from "svelte/store";

export function readableWithInit(initialValue, storeKey = makeId(20)) {
	const { subscribe, set:setter } = writable(initialValue);
	return {
		subscribe,
        init: (n)=>updateReadOnlyStore(storeKey, n, setter)
	};
}

const updateOnlyOnce = {
    stores:{},
    storeIsLocked: checkIfStoreIsLocked,
    lock: setReadableWithInitStoreToLocked,
};
function checkIfStoreIsLocked(storeKey){
    return updateOnlyOnce.stores[storeKey] && updateOnlyOnce.stores[storeKey].isLocked;
}
function setReadableWithInitStoreToLocked(storeKey){
    return updateOnlyOnce.stores[storeKey] = {isLocked: true};
}
function updateReadOnlyStore(storeKey, value, setThisStore){
    if(updateOnlyOnce?.storeIsLocked(storeKey)) 
    {
        return console.warn('Store [',storeKey,'] is already initialized and cannot be updated');
    }
    updateOnlyOnce.lock(storeKey);
    return setThisStore(value);
}

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function traversableNumber(init, maxNumberReference) {
	const { subscribe, set:setValue, update } = writable(init);

  let max;
  maxNumberReference.subscribe((v)=>max=v>0?v-1:0);

  const traverse = (n, direction)=>{
  if (max < 1) return 0;
  const next = direction === "next";
  const prev = !next;
  n += (next ? 1 : -1);
  if(prev && n < 0) return max;
  if(next && n > max) return 0;
  return n;
  }

  const setSafe= (n)=>{
    if (n > max) n = max;
    if(n < 0) n = 0;
    setValue(n);
  }

	return {
		subscribe,
    set: ()=> setSafe(n),
    next: ()=> update((n)=>traverse(n, 'next')),
    previous: ()=> update((n)=>traverse(n, 'prev')),
	};
}
