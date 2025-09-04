import React from "react";
import { useViewport } from "../../components/VPLocation/ViewPort";

export default function App() {
    const { width, height, scrollX, scrollY } = useViewport();
    console.log(
        "width", width, 
        "height", height, 
        "scrollX", scrollX, 
        "scrollY", scrollY);

    return (
        <div style={{ height: "200vh", padding: "20px" }}>
            <h1>Viewport Info</h1>
            <p>Width: {width}px</p>
            <p>Height: {height}px</p>
            <p>Scroll X: {scrollX}px</p>
            <p>Scroll Y: {scrollY}px</p>
        </div>
    );
}
