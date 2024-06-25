// import React, { useState, useEffect, useCallback } from 'react';
// import Modal from './Modal';
// import { useForm, Controller } from "react-hook-form";
// import { Input } from '../handlers/Input';


// export default function CoefModal({ flow, is_open, edgeConnect, closeModal }) {
//     const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: 'onSubmit' });

//     const onSubmit = useCallback((form_data) => {
//         edgeConnect()
//     }, [edgeConnect]);

//     function Coefs({ errors, register }) {
//         const result = []
//         flow.to_coefs_.forEach((coef, comp) => {
//             const name = comp?.GetName() + '_coef';
//             result.push(
//                 (
//                     <Input type={name} inputType={'number'} step="0.01" span={'Вероятность зар.'} errors={errors}
//                         register={register(name, {
//                             required: true,
//                         })} />
//                 )
//             )
//         })
//         return result;
//     }

//     const RenderBody = () => {
//         return(
//             <>
//                 Суммарное значение не должно превышать 1.0
//                 {Coefs({errors: errors, register: register})}
//             </>
//         )
//     }

//     return (
//         <>
//             <Modal isOpen={is_open} typeModal={"another"}
//                 content={{
//                     header_text: "Редактирование коэффициентов",
//                     body_text: [],
//                     buttons_funcs_label: [
//                         ['Создать ребро', handleSubmit(onSubmit)],
//                         ['Отмена', closeModal]
//                     ]
//                 }} handleSubmit={handleSubmit(onSubmit)}
//             />
//         </>
//     )
// }