let serviceId        = parseInt('0x0000dfb0');
let characteristicId = parseInt('0x0000dfb1');

let blunoCharacteristic = null;

document.querySelector("#connect").onclick = function () {
  navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceId] }]
  }).then(device => {
    return device.gatt.connect();
  }).then(server => {
    return server.getPrimaryService(serviceId);
  }).then(service => {
    return service.getCharacteristic(characteristicId);
  }).then(characteristic => {
    blunoCharacteristic = characteristic;
  });
};

function sendColorToDevice(hexString, onMillis, offMillis) {
  if (!blunoCharacteristic) {
   swal({
  title: "Connect First",
  text: "Sync your device to select a color",
  icon: "warning",
  buttons: true,
  dangerMode: true,
})
  }

  let hexBytes = hexString.match(/[A-Za-z0-9]{2}/g);
  let bytes = hexBytes.map(b => parseInt(b, 16));
  bytes.push(Math.floor(onMillis / 10));
  bytes.push(Math.floor(offMillis / 10));
  blunoCharacteristic.writeValue(new Uint8Array(bytes));
};

var colorWheel = new ColorWheel({
  container: "#the-color-picker",
  onColorSelected: function (color) {
    console.log("color selected:", color);
    sendColorToDevice(color, 1000, 0);
  }
});
colorWheel.bindData(5);
