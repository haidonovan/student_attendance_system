"use client"
import { useState } from "react";
import { Route } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function Hello (){
    const [msg, setMsg] = useState("");
    const clickFun = async () =>{
        // you forget to write /api/test inside fetch param
        const read = await fetch("/api/test");
        const json = await read.json();
        setMsg(json.data);
        console.log(json.data);
    }
    
 return(
    
    <>
        <Button onClick={clickFun}>Don't thai to me</Button>
        <p>{msg}</p>

    </>

 )
}