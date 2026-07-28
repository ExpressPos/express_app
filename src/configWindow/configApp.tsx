import React, {useState} from "react";
import "./styles.css";
import { ConfigModel } from "src/model/config-model";
import config from "forge.config";

const ConfigApp = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [terminalId, setTerminalId] = useState('');
    const [urlAPG, setUrlAPG] = useState('');
    const [secret, setSecret] = useState('');

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOption && selectedOption !== '' &&
            companyId !== '' &&
            terminalId !== '' &&
            urlAPG !== '' &&
            secret !== '') {
            console.log('Valor seleccionado:', selectedOption);
            console.log('companyId:', companyId);
            console.log('terminalId:', terminalId);
            console.log('urlAPG:', urlAPG);
            console.log('secret:', secret);
            try {
                const config: ConfigModel = {
                    url: selectedOption,
                    invertDisplay: false,
                    clientDeviceId: "",
                    companyId: companyId,
                    terminalId: terminalId,
                    apgUrl: urlAPG,
                    secret: secret
                }
                window.electronAPI.setConfig(JSON.stringify(config));
            } catch (error) {
                console.error('Error creando la config local:', error);
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
                    <option value="https://expresspos-test.firstData.com">CAT Fiserv</option>
                </select>

                <label htmlFor="companyId">Company ID:</label>
                <input
                    id="companyId"
                    type="text"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="Company ID"
                />

                <label htmlFor="terminalId">Terminal ID:</label>
                <input
                    id="terminalId"
                    type="text"
                    value={terminalId}
                    onChange={(e) => setTerminalId(e.target.value)}
                    placeholder="Terminal ID"
                />

                <label htmlFor="urlAPG">URL APG:</label>
                <input
                    id="urlAPG"
                    type="text"
                    value={urlAPG}
                    onChange={(e) => setUrlAPG(e.target.value)}
                    placeholder="URL APG"
                />

                <label htmlFor="secret">Secret:</label>
                <input
                    id="secret"
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Secret"
                />

                <button className="save-button" type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default ConfigApp;