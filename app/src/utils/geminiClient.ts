import { IncorrectRequest } from "../errors";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

const fileManager = new GoogleAIFileManager(geminiApiKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

function getMimeType(format: string): string | null {
	const mimeTypes: { [key: string]: string } = {
		png: "image/png",
		jpeg: "image/jpeg",
		jpg: "image/jpeg",
		webp: "image/webp",
		heic: "image/heic",
		heif: "image/heif",
	};

	return mimeTypes[format.toLowerCase()] || null;
}

export async function uploadFile(imagePath: string, format: string): Promise<{ image_url: string; measure_value: string }> {
	const mimeType = getMimeType(format);

	if (!mimeType) {
		throw new IncorrectRequest(`Formato de imagem inválido: ${format}`, "INVALID_DATA");
	}

	const uploadResponse = await fileManager.uploadFile(imagePath, {
		mimeType: mimeType,
	});

	const modelPro = genAI.getGenerativeModel({
		model: "gemini-1.5-pro",
	});

	const modelFlash = genAI.getGenerativeModel({
		model: "gemini-1.5-flash",
	});

	let result = null;

	try {
		result = await modelPro.generateContent([
			{
				fileData: {
					mimeType: uploadResponse.file.mimeType,
					fileUri: uploadResponse.file.uri,
				},
			},
			{ text: "perform an accurate reading of the water meter or gas meter and return only the integer numeric value, excluding any additional text." },
		]);
	} catch (error) {
		result = await modelFlash.generateContent([
			{
				fileData: {
					mimeType: uploadResponse.file.mimeType,
					fileUri: uploadResponse.file.uri,
				},
			},
			{ text: "perform an accurate reading of the water meter or gas meter and return only the integer numeric value, excluding any additional text." },
		]);
	}

	const response = {
		image_url: uploadResponse.file.uri,
		measure_value: String(result.response.text()).trim(),
	};

	return response;
}
