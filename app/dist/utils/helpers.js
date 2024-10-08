"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMeasuretype = validateMeasuretype;
exports.validateBase64 = validateBase64;
exports.validateImageType = validateImageType;
exports.getImageType = getImageType;
exports.removeBase64Prefix = removeBase64Prefix;
exports.saveImage = saveImage;
exports.isValidISODateTime = isValidISODateTime;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function validateMeasuretype(measure_type) {
    const validTypes = ["WATER", "GAS"];
    const normalizedMeasureType = measure_type.toUpperCase();
    if (!validTypes.includes(normalizedMeasureType)) {
        return false;
    }
    return true;
}
function validateBase64(base64) {
    const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
    return base64Regex.test(base64);
}
function validateImageType(base64) {
    const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
    const match = base64.match(base64Regex);
    return match ? true : false;
}
function getImageType(base64) {
    const base64Regex = /^data:image\/(png|jpeg|jpg|webp|heic|heif);base64,[a-zA-Z0-9+/=]+$/;
    const match = base64.match(base64Regex);
    return match ? match[1] : null;
}
function removeBase64Prefix(imageBase64) {
    const base64Prefix = /^data:image\/[a-zA-Z]+;base64,/;
    return imageBase64.replace(base64Prefix, "");
}
const dirname = __dirname;
console.log(dirname);
function saveImage(base64, format) {
    return new Promise((resolve, reject) => {
        const imageBase64 = removeBase64Prefix(base64);
        const buffer = Buffer.from(imageBase64, "base64");
        const imageDir = path.join(dirname, "..", "images");
        const filePath = path.join(imageDir, `image.${format}`);
        fs.mkdir(imageDir, { recursive: true }, (err) => {
            if (err) {
                reject(err);
                return;
            }
            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(filePath);
                }
            });
        });
    });
}
function isValidISODateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return !isNaN(date.getTime());
}
