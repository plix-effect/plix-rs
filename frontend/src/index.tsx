import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui/style/index.scss";

import {MobilifyContainer} from "./ui/components/app/MobilifyContainer";

const rnd = Math.random();

ReactDOM.render(
    <MobilifyContainer rnd={rnd}/>,
    document.getElementById("reactApp")
);