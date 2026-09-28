import type { ChangeEventHandler } from "react";

type InputBoxProps = {
    label:string;
    placeholder?:string;
    type?:string;
    value?:string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
};
export function InputBox({
    label,
    placeholder,
    type ="text",
    value,
    onChange
}: InputBoxProps){
    return (
        <div className="input-group">
             <label>
                {label}
             </label>
             <input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}>
             </input>
        </div>
    )
}