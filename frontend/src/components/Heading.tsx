type HeadingProps ={
    label:string;
};
export function Heading ({label} : HeadingProps){
    return(
        <div className="auth-heading">
             {label}
        </div>
    )
}