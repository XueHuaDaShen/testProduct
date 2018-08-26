// import MD5 from 'MD5'
import Rsa from 'node-rsa'
// const pubkey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEvJpHpJZlrYD/6bbTdWjm+FhKr2ckcwfczWvMXPyHgaiWVGTGlf0Kw2hnSjyRRJSx5QA/B1lUI/7W4M/GTNDYsUBf181avQ79Oo+UqoBsGXvPhsUsvQv5wumrrSyfZGRhS0yYOJyDYyAKe2RAVhjMDI9uG497IqPPPqy4Fn/vYQIDAQAB-----END PUBLIC KEY-----';
// var $pem = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEvJpHpJZlrYD/6bbTdWjm+FhKr2ckcwfczWvMXPyHgaiWVGTGlf0Kw2hnSjyRRJSx5QA/B1lUI/7W4M/GTNDYsUBf181avQ79Oo+UqoBsGXvPhsUsvQv5wumrrSyfZGRhS0yYOJyDYyAKe2RAVhjMDI9uG497IqPPPqy4Fn/vYQIDAQAB';
// setMaxDigits(259);
// var proKey = new RSAKeyPair("10001", '10001', $pem, 1024);
// export default function paramCryptFn(data, isCrypt) {
//   const encrypt = new JSEncrypt();
//   let res = {};
//   encrypt.setPublicKey(pubkey);
//   if(isCrypt === false){
//     res = data;
//   }else{
//     res = { param: encrypt.encrypt(JSON.stringify(data)) }
//   }
//   return res
// }

export default function paramCryptFn (data, isCrypt) {
  // const encrypt = new JSEncrypt();
  // console.log('Rsa----',Rsa)
  // var text = encryptedString(proKey, JSON.stringify(data), RSAAPP.PKCS1Padding, RSAAPP.RawEncoding);
  // var base64Val = window.btoa(text);
  let res = {}
  if (isCrypt === false) {
    res = data
  } else {
    res = setCrypt(data)
  }
  // console.log('res-------',res)
  return res
}

function setCrypt (data) {
  var publicKey = new Rsa('-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEvJpHpJZlrYD/6bbTdWjm+FhK\nr2ckcwfczWvMXPyHgaiWVGTGlf0Kw2hnSjyRRJSx5QA/B1lUI/7W4M/GTNDYsUBf\n181avQ79Oo+UqoBsGXvPhsUsvQv5wumrrSyfZGRhS0yYOJyDYyAKe2RAVhjMDI9u\nG497IqPPPqy4Fn/vYQIDAQAB\n-----END PUBLIC KEY-----')
  publicKey.setOptions({encryptionScheme: 'pkcs1'})

  var encrypted = publicKey.encrypt(data, 'base64')

  return { param: encrypted }
}
