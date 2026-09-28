import {Link} from "react-router-dom";
type BottomWarningProps={
    label:string;
    buttonText:string;
    to:string;
};
export function BottomWarning({
    label,
    buttonText,
    to
}:BottomWarningProps){
    return (

        <div className="login-text">
             <span>{label}</span>
             <Link to = {to}>
             {buttonText}
             </Link>
        </div>
    );
}