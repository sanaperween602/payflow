type ButtonProps={
    label:string;
    onClick: () => void;
};
export function Button({label , onClick}:ButtonProps){
    return (
        <button
        className="signup-button"
        onClick={onClick}
        type="button"
        >
          {label}
        </button>
    );
}