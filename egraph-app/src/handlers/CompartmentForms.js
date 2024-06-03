
import { Input, Validators } from "./Input";

export function AddingFormInputs({ errors, register }) {
    return (
        <>
            <Input type={'name'} inputType={'text'} span={'Название'} errors={errors}
                register={register('name', {
                    required: true,
                    pattern: Validators.text.pattern
                })} />
            <Input type={'population'} inputType={'number'} span={'Популяция'} errors={errors}
                register={register('population', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
            <Input type={'ins'} inputType={'number'} span={'Кол-во входных'} errors={errors}
                register={register('ins', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
            <Input type={'outs'} inputType={'number'} span={'Кол-во выходных'} errors={errors}
                register={register('outs', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
        </>
    )
}

export function EditableFormInputs({ errors, register }) {
    return (
        <>
            <Input type={'name'} inputType={'text'} span={'Название'} errors={errors}
                register={register('name', {
                    required: true,
                    pattern: Validators.text.pattern
                })} />
            <Input type={'population'} inputType={'number'} span={'Популяция'} errors={errors}
                register={register('population', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
            <Input type={'ins'} inputType={'number'} span={'Кол-во входных'} errors={errors}
                register={register('ins', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
            <Input type={'outs'} inputType={'number'} span={'Кол-во выходных'} errors={errors}
                register={register('outs', {
                    required: true,
                    pattern: Validators.number.pattern
                })} />
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label class="form-check-label" for="flexCheckDefault">
                    Стартовый компартмент
                </label>
            </div>
        </>
    )
}