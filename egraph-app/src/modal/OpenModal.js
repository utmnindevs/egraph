import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { InputWithSelect, Validators } from '../handlers/Input';

import Modal from './Modal';

import './style_modal/OpenModal.css';
import { openFile } from '../handlers/Save';

export function OpenModal({ isOpen, onCreate, handleOpenExisting, handleCancel }) {
  return (
    <>
      <Modal isOpen={isOpen} typeModal={"device"} content={
        {
          header_text: "Это устройство",
          body_text: "Изменить место хранения <- стиль поправить",
          buttons_funcs_label: [
            ["Создать новую модель", onCreate],
            ["Открыть существующую", handleOpenExisting]
          ]
        }
      } isFormed={false} onCancel={handleCancel}/>
    </>
  );
}



export function NameAndTemplateModal({ isOpen, onCancel, onCreate }) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: 'onSubmit' });
  const onSubmit = useCallback((form_data) => {
    onCreate(form_data);
  });

  const handleCancel = () => {
    onCancel();
  };

  const render_body_form = () => {
    return (<>
      <InputWithSelect
        type={"file_name"}
        inputType={"text"}
        options={
          [{ value: '.egraph', title: 'JSON файл (.egraph)' }, { value: '.json', title: 'JSON файл (.json)' }]
        }
        errors={errors}
        input_register={ register("file_name", {
          required: true,
          pattern: Validators.file_name.pattern
        })}
        select_register={register("file_format")}
      />
    </>)
  }

  return (
    <>
      <Modal typeModal={"device"} isOpen={isOpen} content={{
          header_text: "Имя файла: ",
          body_text: render_body_form(),
          buttons_funcs_label: [
            ["Создать", handleSubmit(onSubmit)],
            ["Отмена", handleCancel]
          ]
        }}/>
    </>
  )
}