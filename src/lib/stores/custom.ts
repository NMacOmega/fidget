import { get, writable, type Readable } from "svelte/store";

/** A Map of store IDs and boolean to track if they have been written to and thus are now locked
 * @example { [StoreKey]: true | false } */
type Stores = {
  [key: string]: boolean
};
/**default is 20 alphanumeric Characters */
type StoreKey= string;

/**@see {@link Stores} */
const lockableStores: Stores = {};

const isStoreLocked = (storeKey:StoreKey)=> lockableStores[storeKey];
const lockStore = (storeKey:StoreKey)=> lockableStores[storeKey];

/**
 * 
 * @param storeKey The Store to look up and update
 * @param value The value to initialize the store to
 * @param initialize The setter function to update 
 * @returns Updates the specified store one time only
 */
const updateReadOnlyStore = <T>(storeKey:StoreKey, value:T, initialize:(value:T)=>void)=>{
  if(isStoreLocked(storeKey))
    return console.warn('Store [',storeKey,'] is already initialized and cannot be updated');
lockStore(storeKey);
return initialize(value);
};

/** 
 * Creates a writable store that can only be written to once
 * @template {T} initialValue The type of value to set the created store
 * @optional keyLength - the length of the key to track the new store. Default is 20 
 * @returns A store with an init function that works only once
*/
export function readableWithInit<T>(initialValue:T, keyLength = 20 ) {
  const storeKey = makeUniqueId(keyLength, Object.keys(lockableStores))
	const { subscribe, set:initialize } = writable(initialValue);
	return {
		subscribe,
        init: (n:T)=>updateReadOnlyStore(storeKey, n, initialize)
	};
}

/**
 *  Creates a unique string of alphanumeric characters compared to provided keys
 * - Uses makeId. See {@link makeId} 
 * @param len the length of the string to make, at least 1 character
 * @param keys an array of keys the result must not match
 * @returns a unique alphanumeric string of specified length
 */
function makeUniqueId(len: number, keys: string[]){
  let result = makeId(len);
  while(keys.includes(result)){
    result = makeId(len);
  }
  return result;
}

/**
 * Creates a random string of alphanumeric characters
 * of length [len]
 * @param len the length of the string to make, at least 1 character
 * @returns an alphanumeric string of specified length
 */
function makeId(len=1) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < len) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}





/**
 * Performs the {@link get} svelte function for each store provided 
 * 
 * and returns the result in one array
 * 
 * @param storesArr an array with each store to retrieve a value using {@link get}
 * 
 * @example 
 * const [width, height, depth] = batchGet([widthStore, heightStore, depthStore])
*/
export function batchGet(storesArr: Readable<unknown>[]): unknown[]{
  return storesArr.reduce((acc, store)=>{
    const result = get(store);
    return [...acc, result];
  }, [] as unknown[]);
}
