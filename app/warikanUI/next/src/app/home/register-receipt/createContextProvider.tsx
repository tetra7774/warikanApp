"use client";
import { useState, Dispatch, SetStateAction, createContext } from "react";

// Indicates whether a file has been uploaded and provides a setter to update the state
// difine type for context
export type FileUploadState = [boolean, Dispatch<SetStateAction<boolean>>];
//　create context
export const FileUploadContext = createContext<FileUploadState | undefined>(undefined);

const Provider = ({ children }: { children: React.ReactNode }) => {
    const [isUploadFile, setIsUploadFile] = useState(false);
    return (
        <FileUploadContext.Provider value={[isUploadFile, setIsUploadFile]}>
            {children}
        </FileUploadContext.Provider >
    );
};

export default Provider;