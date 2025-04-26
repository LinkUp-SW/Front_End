import type React from "react";

import { useState, useRef } from "react";
import {
  Upload,
  FileCheck,
  AlertCircle,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  Button,
} from "@/components";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { addUserResume } from "@/endpoints/userProfile";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { editUserBio } from "@/slices/user_profile/userBioSlice";
// PDF viewer removed as requested

export interface AddResumeModalProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const AddResumeModal: React.FC<AddResumeModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = Cookies.get("linkup_auth_token");
  const userBio = useSelector((state: RootState) => state.userBio.data);
  const dispatch = useDispatch();

  // Handle file validation
  const validateFile = (file: File): boolean => {
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File size exceeds 2MB limit");
      return false;
    }

    // Check file type
    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are accepted");
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setErrorMessage(null);
        setUploadStatus("idle");
      } else {
        e.target.value = "";
      }
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setErrorMessage(null);
        setUploadStatus("idle");
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("uploading");

    try {
      // Simulate upload with a delay
      if (!token) {
        return new Error("You are not authorized to upload resume");
      }

      // Check for PDF corruption (this is a simplified simulation)
      // In a real app, you would validate the PDF on the server
      const isPDFValid = await checkPDFValidity(file);

      if (!isPDFValid) {
        throw new Error("The PDF file appears to be corrupted or invalid");
      }
      const response = await addUserResume(token, file);

      console.log(response);

      dispatch(
        editUserBio({
          ...userBio,
          resume: response.resume,
        })
      );

      setUploadStatus("success");
      toast.success("Your resume has been successfully uploaded");
      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(getErrorMessage(error) || "Failed to upload resume");
      // toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  // Simulate PDF validation
  const checkPDFValidity = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // This is a simplified check - in a real app, you would do more thorough validation
      const reader = new FileReader();
      reader.onload = () => {
        // Check if the PDF starts with the PDF signature '%PDF-'
        const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 5);
        const header = String.fromCharCode.apply(null, Array.from(arr));
        resolve(header.startsWith("%PDF-"));
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 5));
    });
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setErrorMessage(null);
    setUploadStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <Card className="w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className=" dark:border-gray-700">
        <CardDescription className="dark:text-gray-400">
          Upload your resume in PDF format (max 2MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag and drop area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50 dark:border-gray-600 dark:hover:border-gray-500",
            file ? "bg-muted/20 dark:bg-muted/30" : ""
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
            id="resume-uploader"
          />

          {!file ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground dark:text-gray-400 mb-2" />
              <p className="text-sm font-medium dark:text-gray-100">
                Drag and drop your resume here or click to browse
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                PDF format only, max 2MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary dark:text-primary-light" />
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[200px] dark:text-gray-100">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <X className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              </Button>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <Alert
            variant="destructive"
            className="dark:bg-gray-900 dark:!text-red-400 dark:border-red-400"
          >
            <AlertCircle className="h-4 w-4 " />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription
              id="resume-alert-description"
              className="dark:!text-red-300"
            >
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="dark:border-gray-700">
        <Button
          className="w-full affirmativeBtn"
          id="upload-resume-btn"
          onClick={handleUpload}
          disabled={!file || isUploading || uploadStatus === "success"}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : uploadStatus === "success" ? (
            <>
              <FileCheck className="mr-2 h-4 w-4" />
              Uploaded Successfully
            </>
          ) : (
            "Upload Resume"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddResumeModal;
