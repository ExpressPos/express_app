import React, {useState} from "react";
import "./styles.css";
import { ConfigModel } from "src/model/config-model";

const ConfigApp = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [terminalId, setTerminalId] = useState('');
    const [urlAPG, setUrlAPG] = useState('');
    const [apgAuthUrl, setApgAuthUrl] = useState('');
    const [apgAuthData, setApgAuthData] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedOption && selectedOption !== '' &&
            companyId !== '' &&
            terminalId !== '' &&
            urlAPG !== '' &&
            apgAuthUrl !== '' &&
            apgAuthData !== '') {
            try {
                const config: ConfigModel = {
                    url: selectedOption,
                    invertDisplay: false,
                    clientDeviceId: "",
                    companyId: companyId,
                    terminalId: terminalId,
                    apgUrl: urlAPG,
                    apgAuthUrl: apgAuthUrl,
                    apgAuthData: apgAuthData
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
                    <option value="https://argentina.geocom.com.uy">Argentina</option>
                    <option value="https://qaexpress.geocom.com.uy">QAExpress</option>
                    <option value="https://xprargentina.geocom.com.uy">XprArgentina</option>
                    <option value="https://expresspos-test.firstdata.com">Fiserv CAT</option>
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

                <label htmlFor="urlAPG">APG Url:</label>
                <input
                    id="urlAPG"
                    type="text"
                    value={urlAPG}
                    onChange={(e) => setUrlAPG(e.target.value)}
                    placeholder="APG Url"
                />

                <label htmlFor="apgAuthUrl">APG Auth Url:</label>
                <input
                    id="apgAuthUrl"
                    type="text"
                    value={apgAuthUrl}
                    onChange={(e) => setApgAuthUrl(e.target.value)}
                    placeholder="APG Auth Url"
                />

                <label htmlFor="apgAuthData">APG Auth Data:</label>
                <input
                    id="apgAuthData"
                    type="password"
                    value={apgAuthData}
                    onChange={(e) => setApgAuthData(e.target.value)}
                    placeholder="APG Auth Data"
                />

                <button className="save-button" type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default ConfigApp;