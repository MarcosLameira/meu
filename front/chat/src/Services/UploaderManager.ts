import Axios from "axios";
import { UPLOADER_URL } from "../Enum/EnvironmentVariable";
import { UploadedFile } from "./FileMessageManager";

export class UploaderManager {
    public async write(files: FileList, userRoomToken: string): Promise<UploadedFile[]> {
        const formData = new FormData();
        for (const file of files) {
            formData.append(file.name, file);
        }
        formData.append("userRoomToken", userRoomToken);
        const result = await Axios.post(`${UPLOADER_URL}/upload-file`, formData);
        return result.data.reduce((list: UploadedFile[], file: UploadedFile) => {
            list.push(
                new UploadedFile(
                    file.name,
                    file.id,
                    file.location,
                    file.lastModified,
                    file.webkitRelativePath,
                    file.size,
                    file.type
                )
            );
            return list;
        }, []);
    }

    public async delete(fileId: string) {
        try {
            await Axios.delete(`${UPLOADER_URL}/upload-file/${fileId}`);
        } catch (err) {
            console.error("Delete uploaded file error: ", err);
        }
    }
}

export const uploaderManager = new UploaderManager();
