import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { InputWithSelect, Validators } from '../handlers/Input';

import Modal from './Modal';

import './style_modal/OpenModal.css';
import { openFile } from '../handlers/Save';


export function OpenModal({ isOpen, storageType, onChangeStorage, onCreate, handleOpenExisting }) {
  const renderChooseStorageButton = () => {
    return (<>
      <a className='change' onClick={() => {onChangeStorage()}}>Изменить место хранения</a>
    </>);
  }

  const type = storageType ? storageType : "device"

  return (
    <>
      <Modal isOpen={isOpen} typeModal={type} content={
        {
          header_text: type === "device" ? "Это устройство" : "Яндекс Диск",
          body_text: renderChooseStorageButton(),
          buttons_funcs_label: [
            ["Создать новую модель", onCreate],
            ["Открыть существующую", handleOpenExisting]
          ]
        }
      } isFormed={false}/>
    </>
  );
}

export function NameAndTemplateModal({ isOpen, onCancel, onCreate }) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ mode: 'onSubmit' });
  const onSubmit = useCallback((form_data) => {
    onCreate(form_data);
  });

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
            ["Отмена", onCancel]
          ]
        }}/>
    </>
  )
}