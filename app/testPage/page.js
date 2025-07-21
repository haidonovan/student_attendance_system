

// 1. use client to say this page is a client side render
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home(){
    const [msg, setMsg] = useState("");
    
    const handleClick = async () => {
        const res = await fetch("/api/test");
        const json = await res.json();

        setMsg(json.data);
    };

    return (
        <main>
            <Button onClick={handleClick}>Click Me</Button>
            <p>{msg}</p>
        </main>
    )
}