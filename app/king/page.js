"use client"
import { useState } from "react";
import { Route } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function Hello (){
    const [msg, setMsg] = useState("");
    const clickFun = async () =>{
        const read = await fetch("/test");
        const json = await read.json();
        setMsg(json.data);
    }
    
 return(
    
    <>
    <p>{msg}</p>
    <Button onClick>Click ME</Button>
    </>

 )
}