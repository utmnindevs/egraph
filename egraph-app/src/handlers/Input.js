import React from 'react';


export const Validators = {
    text: {
        pattern: {
            value: /^[A-ZА-Я][a-zа-яА-ЯA-Z]{3,19}$/,
            message: "С большой буквы, от 4х до 20ти букв"
        },
    },
    number: {
        pattern: {
            value: /^[0-9]*$/gm,
            message: "Только положительные"
        }
    },
    file_name: {
        pattern: {
            value: /^[^<>?*:/\\"|]+$/gm,
            message: "Имя файла не может содержать: <>?*:/\\\"|"
        }
    }
}

function ErrorMessage({ errors, type }) {
    return (<>{errors && <span style={{ fontSize: '10px', color: "red" }}>{errors[type]?.message}</span>}</>)
}

export function Input({ type, inputType, span, errors, register }) {
    return (<>
        <ErrorMessage errors={errors} type={type} />
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">{span}</span>
            <input type={inputType} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                {...register} required
            />
        </div>
    </>);
}

export function InputWithSelect({ type, inputType, options, errors, input_register, select_register}) {
    return (<>
        <ErrorMessage errors={errors} type={type} />
        <div class="input-group input-group-sm mb-3">
            <input type={inputType} class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" style={{width:'170px'}}
                {...input_register} required
            />
            <select class="form-select" style={{width: '170px'}}
                {...select_register}>
                {options.map((obj) => {
                    return <option value={obj.value}>
                        {obj.title}
                    </option>
                })}
            </select>
        </div>
    </>);
}
