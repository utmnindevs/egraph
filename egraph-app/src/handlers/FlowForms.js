import { Input, Validators } from "./Input";

export function AddingFormInputsFlow({ errors, register }) {
    return (
        <>
            <Input type={'coef'} inputType={'number'} step="0.01" span={'Вероятность зар.'} errors={errors}
                register={register('coef', {
                    required: true,
                    pattern: Validators.float_number.pattern
                })} />
            <Input type={'coef_name'} inputType={'text'} span={"(LaTeX) буква: \\beta"} errors={errors}
                register={register('coef_name', {
                    required: true
                })} />
        </>
    )
}

export function EditableFormInputsFlow({ errors, register }) {
    return (
        <>
            <Input type={'coef'} inputType={'number'} step="0.01" span={'Вероятность зар.'} errors={errors}
                register={register('coef', {
                    required: true,
                    pattern: Validators.float_number.pattern
                })} />
            <Input type={'coef_name'} inputType={'text'} span={'(LaTeX) буква'} errors={errors}
                register={register('coef_name', {
                    required: true
                })} />
        </>
    )
}