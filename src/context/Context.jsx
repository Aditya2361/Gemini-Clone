import { createContext, useState } from "react";
import runChat from "../config/groq"; // <-- Add this line

export const Context = createContext();
const ContextProvider=(props)=>{
    const [input,setInput]=useState("");
    const [recentPrompt, setRecentPrompt]=useState("")
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setloading] = useState(false);
    const [resultData, setResultData] = useState("");
    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }
    const newChat =()=>{
        setloading(false)
        setShowResult(false)
    }

const onSent = async (prompt) => {
   const userPrompt = prompt !== undefined ? prompt : input;
   if (!userPrompt || userPrompt.trim() === "") {
      setloading(false);
      return; // Don't send empty prompts
   }
   setResultData("")
   setloading(true)
   setShowResult(true)
   let response;
   if (prompt !== undefined){
      response = await runChat(prompt);
      setRecentPrompt(prompt)
   } else {
      setPrevPrompts(prev => [...prev, input])
      setRecentPrompt(input)
      response = await runChat(input)
   }
   let responseArray = response.split("**");
   let newResponse = "";
   for(let i = 0; i < responseArray.length; i++) {
      if(i === 0 || i % 2 !== 1){
          newResponse += responseArray[i];
      }
      else{
          newResponse += "<b>" + responseArray[i] + "</b>";
      }
   }
   let newResponse2 = newResponse.split("*").join("</br>")
   let newResponseArray = newResponse2.split("");
   for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + "")
   }

   setResultData(newResponse2)
   setloading(false)
   setInput("")
   setRecentPrompt(input)
}


    const contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,     
        newChat

    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider