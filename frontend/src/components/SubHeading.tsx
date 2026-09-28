type SubHeadingProps={
    label:string;
};
export function SubHeading ({label}:SubHeadingProps){
    return(
        <div className="auth-subheading">
            {label}
        </div>
    )
}