// hook is just a reusable function , which we required in many components for whcih
// instead of rewriting everywhere we used to declear at one place and used that 
// function by just importing it:::>>>>
// we are creating a function and just exporting it :: >>

import React, {useState} from "react";
const useSetVal = (initialval=0)=>{
    const [val , setVal] = useState(initialval)
    const incrementval = ()=>{
        setVal(val+1);
    }
    const decrementval = ()=>{
        setVal(val-1);
    }
    return {val , incrementval , decrementval}; 
}

export default useSetVal;


