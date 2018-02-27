let ctext1 = [];
let ctext2 = [];
let ctext = [];
let display_ctext = '';
let display_key = '';
let crib = [];
let result = [];

// Convert a hex string to a byte array
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xF).toString(16));
  }
  return hex.join("");
}

function on_ctext1_changed() {
  let string = document.getElementById("ctext1").value;
  ctext1 = hexToBytes(string);
  xorstrings();
}

function on_ctext2_changed() {
  let string = document.getElementById("ctext2").value;
  ctext2 = hexToBytes(string);
  xorstrings();
}

function xorstrings() {
  let lower = Math.min(ctext1.length, ctext2.length);
  let result = [];
  display_ctext = '_'.repeat(lower);
  display_key = '_'.repeat(lower);
  document.getElementById('c_message').value = display_ctext;
  document.getElementById('c_key').value = display_key;
  for (var i = 0; i < lower; i++) {
    result.push(ctext1[i] ^ ctext2[i]);
  }
  ctext = result;
}

function bytes2str(bytes) {
  let result = "";
  for (var i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

// https://stackoverflow.com/a/6226756/5456794
function str2bytearray(str) {
  var bytes = []; // char codes

  for (var i = 0; i < str.length; ++i) {
    var code = str.charCodeAt(i);
    bytes = bytes.concat([code]);
  }
  return bytes;
}

function crib_change() {
  let cribWord = document.getElementById("crib").value;
  crib = str2bytearray(cribWord);
  if (ctext.length < 1 )
    return;

  // console.log("crib: " + crib);

  let positions = ctext.length - crib.length + 1;
  result = [];
  for (var i = 0; i < positions; i++) {
    let single_result = [];
    for (var j = 0; j < crib.length; j++) {
      single_result.push(crib[j] ^ ctext[i+j]);
    }
    result[i] = bytes2str(single_result);
  }

  // console.log(result);

  charset = "^[" + document.getElementById("charset").value + "]+$";
  var pattern = new RegExp(charset);

  document.getElementById("results").innerHTML = "";
  for (var i = 0; i < result.length; i++) {
    var outstring = "result[" + i + "]: "+result[i];
    var textnode = document.createTextNode(outstring);
    var node = document.createElement("LI");
    node.appendChild(textnode);
    if (pattern.test(result[i])) {
      node.style.color = "red";
    }
    document.getElementById("results").appendChild(node);
  }
}

function accept_crib() {
  var index = parseInt(document.getElementById('index').value);
  if (index < result.length) {
    var part_of_msg = confirm("Is this crib part of the message or key? Please choose OK for 'message'");
    let cribWord = document.getElementById("crib").value;
    let crib_len = cribWord.length;
    if (part_of_msg) {
      display_ctext = display_ctext.substr(0, index) + cribWord + display_ctext.substr(index+crib_len);
      display_key = display_key.substr(0, index) + result[index] + display_key.substr(index+crib_len);
    } else {
      display_key = display_key.substr(0, index) + cribWord + display_key.substr(index+crib_len);
      display_ctext = display_ctext.substr(0, index) + result[index] + display_ctext.substr(index+crib_len);
    }
    document.getElementById('c_message').value = display_ctext;
    document.getElementById('c_key').value = display_key;
  } else {
    alert("Invalid position !");
  }
}

on_ctext1_changed();
on_ctext2_changed();
