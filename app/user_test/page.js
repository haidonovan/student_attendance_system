"use client"
import { Button } from "@/components/ui/button";

export default function api(){
    const handler = async=> (){
        const read = await fetch("/api/user");
    }
    return(
    <>
        <Button onClick={handler}>Get API</Button>
        <p></p>

    </>

    );
}