import { usb, Device } from 'usb';
import { PrinterManager } from "./printer-manager";

class UsbManager {
  private printerManager: PrinterManager;
  private attachListener?: (device: Device) => void;
  private detachListener?: (device: Device) => void;

  constructor(printerManager: PrinterManager) {
    this.printerManager = printerManager;
  }

  /**
   * Intenta obtener el nombre del producto (iProduct string descriptor).
   * Si falla (permisos, driver, etc.) devuelve un fallback con VID/PID en hex.
   */
  private getDeviceName(device: Device): Promise<string> {
    return new Promise((resolve) => {
      const vid = device.deviceDescriptor.idVendor;
      const pid = device.deviceDescriptor.idProduct;
      const fallback = `USB\\VID_${vid.toString(16).padStart(4, '0').toUpperCase()}&PID_${pid.toString(16).padStart(4, '0').toUpperCase()}`;

      try {
        device.open();
      } catch (e) {
        resolve(fallback);
        return;
      }

      const iProduct = device.deviceDescriptor.iProduct;
      if (!iProduct) {
        try { device.close(); } catch { /* ignore */ }
        resolve(fallback);
        return;
      }

      device.getStringDescriptor(iProduct, (err, data) => {
        try { device.close(); } catch { /* ignore */ }
        if (err || !data) {
          resolve(fallback);
        } else {
          resolve(String(data));
        }
      });
    });
  }

  public checkPrinterStatus(): void {
    console.log("Starting check printer status");
    const devices = usb.getDeviceList();
    devices.forEach(async (device) => {
      const vid = device.deviceDescriptor.idVendor;
      const pid = device.deviceDescriptor.idProduct;
      const name = await this.getDeviceName(device);
      this.printerManager.registerPrinter(vid, pid, name);
    });
  }

  public startUsbListener(): void {
    console.log("Starting usb monitoring");

    this.attachListener = async (device: Device) => {
      const vid = device.deviceDescriptor.idVendor;
      const pid = device.deviceDescriptor.idProduct;
      const name = await this.getDeviceName(device);
      console.log('Dispositivo USB conectado: ' + JSON.stringify({ vendorId: vid, productId: pid, deviceName: name }));
      this.printerManager.registerPrinter(vid, pid, name);
    };

    this.detachListener = (device: Device) => {
      const vid = device.deviceDescriptor.idVendor;
      const pid = device.deviceDescriptor.idProduct;
      console.log('Dispositivo USB desconectado: ' + JSON.stringify({ vendorId: vid, productId: pid }));
      this.printerManager.unRegisterPrinter(vid, pid);
    };

    usb.on('attach', this.attachListener);
    usb.on('detach', this.detachListener);
  }

  public stopUsbListener(): void {
    console.log("Stopping usb monitoring");
    if (this.attachListener) {
      usb.removeListener('attach', this.attachListener);
      this.attachListener = undefined;
    }
    if (this.detachListener) {
      usb.removeListener('detach', this.detachListener);
      this.detachListener = undefined;
    }
  }
}

export { UsbManager };
