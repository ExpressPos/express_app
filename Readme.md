Requisitos:
Node 22 o superior.
python 3


************************************ Windows ************************************
Versiones usadas:
Python 3.12.5
Node 20.17.0

https://www.python.org/downloads/ - descargar el .exe e instalacion completa(pip,etc)
build tool visual studio, instalar los complementos de c++

** pip install setuptools

Para correr el npm run publish por primera vez, quizas de error de privilegios:
    **  El cliente no dispone de un privilegio requerido.
- Probar abrir la terminal como admin
- Buscar en win: gpedit.msc e ir Configuración del equipo > Configuración de Windows > Configuración de seguridad > Directivas locales > Asignación de derechos de usuario
- Asegurate de que tu usuario esté listado ahí (o el grupo Usuarios).

************************************ Linux ************************************

sudo apt-get install libudev-dev
sudo apt install rpm
sudo apt install ubuntu-restricted-extras


LOGS CONFIGURATION
Windows: C:\Users\<NombreDeUsuario>\AppData\Roaming\express_app
macOS: /Users/<NombreDeUsuario>/Library/Application Support/express_app
Linux: /home/<NombreDeUsuario>/.config/express_app

************************************ Release ************************************

1. Cambiar el nro de version en el "package.json"
2. Correr "npm run release"
3. En windows esto genera 3 archivos(latest.yml, Express.Pos.Setup.VERSION.exe, Express.Pos.Setup.VERSION.exe.blockmap) en /dist
4. En linux esto genera 2 archivos(latest-linux.yml, Express.Pos.VERSION.AppImage) en /dist
5. Subir estos archivos a un release nuevo en GitHub y marcar el release como "latest", para que los clientes, automaticamente descarguen e instalen la nueva versión
