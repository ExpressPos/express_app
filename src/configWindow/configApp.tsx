import React, {useState} from "react";
import "./styles.css";

const ConfigApp = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOption && selectedOption !== '') {
            console.log('Valor seleccionado:', selectedOption);
            try {
                window.electronAPI.setConfigUrl(selectedOption);
            } catch (error) {
                console.error('Error al obtener el path del logo:', error);
            }
        }
    };

    const onClose = () => {
        try {
            window.electronAPI.closeApp();
        } catch (error) {
            console.error('Error al cerrar la aplicación:', error);
        }
    }

    const CloseButton = () => (
        <button className="close-button" onClick={onClose}>x</button>
    );

    return (
        <div className="card">
            <CloseButton></CloseButton>
            <h2>Config. de ambiente</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="combo">Seleccione una opción:</label>
                <select id="combo" value={selectedOption} onChange={handleChange}>
                    <option value="">-- Elija una opción --</option>
                    <option value="https://posexpress.geocom.com.uy">PosExpress</option>
                    <option value="https://posexpressmobile.geocom.com.uy">PosExpressMobile</option>
                    <option value="https://xprandroid.geocom.com.uy">XprAndroid</option>
                    <option value="https://xprstg.geocom.com.uy">XprStg</option>
                    <option value="https://argentina.geocom.com.uy">Argentina</option>
                    <option value="https://qaexpress.geocom.com.uy">QAExpress</option>
                    <option value="https://xprargentina.geocom.com.uy">XprArgentina</option>
                </select>

                <button className="save-button" type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default ConfigApp;
