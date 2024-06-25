import Modal from "./Modal"
import "./style_modal/ChooseStorageModal.css"

export function ChooseStorageModal(props, isOpen) {
    function authorizeYandex() {
        const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=8c3ee706165741f0b0434e8ef1be2e87`;
        window.location.href = authUrl;
      }
    const renderBody = () => {
        return (
            <>
                <div className="buttons-image">
                    <div className="type device" onClick={() => { props.setStorageType("device") }}>
                        <div className="image">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#71C2FF" width="48px" height="48px" viewBox="0 0 48 48" version="1.1">
                                <g id="surface1">
                                    <path d="M 13.5 33 C 14.328125 33 15 32.328125 15 31.5 C 15 30.671875 14.328125 30 13.5 30 C 12.671875 30 12 30.671875 12 31.5 C 12 32.328125 12.671875 33 13.5 33 M 9 31.5 C 9 32.328125 8.328125 33 7.5 33 C 6.671875 33 6 32.328125 6 31.5 C 6 30.671875 6.671875 30 7.5 30 C 8.328125 30 9 30.671875 9 31.5 " />
                                    <path d="M 48 33 C 48 36.3125 45.3125 39 42 39 L 6 39 C 2.6875 39 0 36.3125 0 33 L 0 28.53125 C 0 27.277344 0.316406 26.039062 0.914062 24.9375 L 8.332031 11.347656 C 9.121094 9.898438 10.636719 9 12.28125 9 L 35.71875 9 C 37.363281 9 38.878906 9.898438 39.667969 11.347656 L 47.085938 24.9375 C 47.683594 26.039062 48 27.277344 48 28.53125 Z M 10.964844 12.78125 L 4.777344 24.128906 C 5.171875 24.042969 5.578125 24 6 24 L 42 24 C 42.421875 24 42.828125 24.042969 43.222656 24.125 L 37.035156 12.78125 C 36.773438 12.296875 36.265625 12 35.71875 12 L 12.28125 12 C 11.730469 12 11.226562 12.296875 10.960938 12.78125 Z M 3 30 L 3 33 C 3 34.65625 4.34375 36 6 36 L 42 36 C 43.65625 36 45 34.65625 45 33 L 45 30 C 45 28.34375 43.65625 27 42 27 L 6 27 C 4.34375 27 3 28.34375 3 30 " />
                                </g>
                            </svg>
                        </div>
                        <a>Это устройство</a>
                    </div>
                    <div className="type yandex" onClick={() => { props.setStorageType("yandex"); authorizeYandex() }}>
                        <div className="image">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px" clip-rule="evenodd"><path fill="#263238" d="M46.023,15.908c-1.872-2.065-6.4-2.72-9.697-2.927c-1.462-0.094-2.919-0.35-4.333-0.762 c-0.639-0.178-1.278-0.403-1.902-0.645c-2.772-1.1-7.345-2.158-12.28-0.138c-0.157,0.069-0.31,0.123-0.453,0.198 c-0.152,0.055-0.306,0.133-0.463,0.202c-4.826,2.246-7.164,6.323-8.24,9.106c-0.246,0.622-0.515,1.244-0.819,1.834 c-0.656,1.317-1.449,2.556-2.373,3.693c-2.092,2.55-4.678,6.313-4.448,9.085c0.037,0.488,0.161,0.948,0.396,1.36 c0.457,0.819,1.197,1.251,1.765,1.518c4.138,1.98,13.728,0.98,24.03-4.266C38.053,30.17,45.301,23.812,46.65,19.434 c0.19-0.598,0.375-1.435,0.086-2.326C46.597,16.665,46.347,16.271,46.023,15.908z" /><path fill="#2962ff" fill-rule="evenodd" d="M46.681,16.918c2.105,4.713-6.419,13.004-18.953,18.482 S2.984,41.63,1.289,36.755C0.085,33.293,8.103,24.05,20.637,18.573S45.258,13.732,46.681,16.918z" clip-rule="evenodd" /><path fill="#fff" fill-rule="evenodd" d="M14.073,33.98c-0.881-2.016,3.511-5.881,9.811-8.635 s12.12-3.35,13.001-1.334c0.881,2.016-3.511,5.881-9.811,8.635S14.954,35.997,14.073,33.98z" clip-rule="evenodd" /></svg>
                        </div>
                        <a>Яндекс Диск</a>
                    </div>
                </div>
            </>

        )
    }

    return (
        <>
            <Modal isFormed={false} isOpen={isOpen} typeModal={"info"}
                content={{
                    header_text: "Сохранять модели в:",
                    body_text: renderBody(),
                    buttons_funcs_label: []
                }}

            />
        </>
    )
}