export const thaiNumber = value => String(value).replace(/\d/g, digit => '๐๑๒๓๔๕๖๗๘๙'[Number(digit)])
