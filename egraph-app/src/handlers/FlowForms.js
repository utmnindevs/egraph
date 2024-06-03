import { Input, Validators } from "./Input";

export function EditableFormInputsFlow({ errors, register }) {
    return (
        <>
            <Input type={'coef'} inputType={'number'} step="0.01" span={'Вероятность зар.'} errors={errors}
                register={register('coef', {
                    required: true,
                    pattern: Validators.float_number.pattern
                })} />
        </>
    )
}