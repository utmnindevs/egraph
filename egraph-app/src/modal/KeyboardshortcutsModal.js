import React, { useState } from 'react';
import Modal from './Modal';
import './style_modal/Modal.css'; // Подключаем стили

const KeyboardShortcutsModal = ({ isOpen, handleClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const hotkeys = [
        { key: 'Ctrl + S', action: 'Сохранить', category: 'Редактирование' },
        { key: 'Ctrl + C', action: 'Копировать', category: 'Редактирование' },
        { key: 'Ctrl + V', action: 'Вставить', category: 'Редактирование' },
        { key: 'Ctrl + Z', action: 'Отменить', category: 'Редактирование' },
        { key: 'Alt + Shift + F', action: 'Меню "Файл"', category: 'Меню' },
        { key: 'Alt + Shift + E', action: 'Меню "Правка"', category: 'Меню' },
        { key: 'Alt + Shift + H', action: 'Меню "Справка"', category: 'Меню' },
        { key: 'Alt + Shift + M', action: 'Меню "Модель"', category: 'Меню' },
        { key: 'Ctrl + Shift + 1', action: 'Переключить на вкладку "Модель"', category: 'Навигация' },
        { key: 'Ctrl + Shift + 2', action: 'Переключить на вкладку "Изображение"', category: 'Навигация' },
        { key: 'Ctrl + Shift + 3', action: 'Переключить на вкладку "Результаты"', category: 'Навигация' },
        { key: 'Ctrl + Alt + K', action: 'Увеличить', category: 'Действия с объектами' },
        { key: 'Ctrl + Alt + J', action: 'Уменьшить', category: 'Действия с объектами' }

    ];

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredHotkeys = hotkeys.filter(hotkey =>
        hotkey.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hotkeysByCategory = filteredHotkeys.reduce((acc, hotkey) => {
        if (!acc[hotkey.category]) {
            acc[hotkey.category] = [];
        }
        acc[hotkey.category].push(hotkey);
        return acc;
    }, {});

    const hotkeysContent = {
        header_text: "Горячие клавиши",
        body_text: (
            <div className="keyboard-shortcuts-modal">
                <div className="modal-header">
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="modal-body">
                    {Object.entries(hotkeysByCategory).map(([category, hotkeys]) => (
                        <div key={category}>
                            <strong>{category}:</strong>
                            <ul>
                                {hotkeys.map((hotkey, index) => (
                                    <li key={index}>{hotkey.key} - {hotkey.action}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        ),
        buttons_funcs_label: [
            ["Закрыть", handleClose]
        ]
    };

    return (
        <Modal isOpen={isOpen} typeModal="info" content={hotkeysContent} />
    );
};

export default KeyboardShortcutsModal;