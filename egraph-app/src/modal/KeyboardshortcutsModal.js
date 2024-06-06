import React, { useState } from 'react';
import Modal from './Modal';
import './style_modal/KeyboardshortcutsModal.css'; // Подключаем стили

const KeyboardShortcutsModal = ({ isOpen, handleClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const hotkeys = [
        { key: 'Ctrl + S', action: 'Сохранить' },
        { key: 'Ctrl + C', action: 'Копировать' },
        { key: 'Ctrl + V', action: 'Вставить' },
        { key: 'Ctrl + Z', action: 'Отменить' }
    ];

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredHotkeys = hotkeys.filter(hotkey =>
        hotkey.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hotkeysContent = {
        header_text: "Горячие клавиши",
        body_text: (
            <>
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <ul>
                    {filteredHotkeys.map((hotkey, index) => (
                        <li key={index}><strong>{hotkey.key}</strong>: {hotkey.action}</li>
                    ))}
                </ul>
            </>
        ),
        buttons_funcs_label: [
            ["Закрыть", handleClose]
        ]
    };

    return (
        <Modal isOpen={isOpen} typeModal="info" content={hotkeysContent}>
            <div className="sidebar">
                <ul>
                    <li>Действия с объектами</li>
                    <li>Меню</li>
                    <li>Навигация</li>
                    <li>Редактирование</li>
                </ul>
            </div>
        </Modal>
    );
};

export default KeyboardShortcutsModal;
