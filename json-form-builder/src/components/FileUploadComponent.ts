import { FormState, FormField } from "../types";
import {
    getMultiLangText,
    disableField,
    createErrorContainer,
    appendError,
    handleRequiredValidation,
    createInfoIcon,
    getLabelText,
    emptyInvalidFn,
    getAcceptString,
    mimeToLabel
} from "../utils/utils";
import { uploadIconSvg, trashIconSvg, fileIconSvg } from "../utils/icons";

/* ----------------------- Base64 Converter ----------------------- */
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result!.toString().split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/* ----------------------- Allowed File Types Text ----------------------- */
function getAllowedFileTypesText(allowedTypes: string[], maxSizeMB: number): string {
    const uniqueTypes = Array.from(new Set(allowedTypes));
    const labels = uniqueTypes.map(mimeToLabel).filter(Boolean).join(", ");
    return `${labels} (max. ${maxSizeMB} MB)`;
}

/* ========================================================================
   FILE UPLOAD FIELD
   ======================================================================== */
export const createFileUploadField = (
    state: FormState,
    field: FormField
): HTMLDivElement => {

    const wrapper = document.createElement("div");
    wrapper.className = `form-field file-upload ${field.cssClasses?.join(" ") || ""}`;

    /* ----------------------- LABEL ----------------------- */
    const labelDiv = document.createElement("div");
    labelDiv.className = "label-div-display";

    const label = document.createElement("label");
    label.innerHTML = getLabelText(state, field);
    label.htmlFor = field.id;

    if (field.info) {
        const infoIcon = createInfoIcon(getMultiLangText(state, field.info));
        label.appendChild(infoIcon);
    }

    labelDiv.appendChild(label);
    wrapper.appendChild(labelDiv);

    /* ----------------------- CONFIG ----------------------- */
    const allowedTypes = field.acceptedFileTypes || [];
    const isPhotoUpload = allowedTypes.length > 0 && allowedTypes.every(t => t.startsWith("image/"));
    const maxSizeMB = field.maxFileSizeMB || 5;
    const maxBytes = maxSizeMB * 1024 * 1024;

    /* ----------------------- UPLOAD UI ----------------------- */
    const uploadArea = document.createElement("div");
    uploadArea.className = "custom-upload-area";

    const input = document.createElement("input");
    input.type = "file";
    input.id = field.id;
    input.multiple = false;
    input.accept = getAcceptString(allowedTypes);
    input.style.display = "none";
    input.oninvalid = emptyInvalidFn(input);

    if (field.disabled) disableField(input);

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "icon-wrapper";
    iconWrapper.style.marginBottom = "10px";
    iconWrapper.innerHTML = uploadIconSvg;

    const text = document.createElement("div");
    text.innerHTML = `<span class="upload-text" style="color:#1B75D0; font-weight:600;">Click to upload</span> or drag & drop`;

    const infoText = document.createElement("div");
    infoText.style.marginTop = "6px";
    infoText.style.fontSize = "12px";
    infoText.style.color = "#666";
    infoText.textContent =
        allowedTypes.length > 0
            ? getAllowedFileTypesText(allowedTypes, maxSizeMB)
            : "Supported formats (max size applies)";

    uploadArea.appendChild(iconWrapper);
    uploadArea.appendChild(text);
    uploadArea.appendChild(infoText);

    wrapper.appendChild(input);
    wrapper.appendChild(uploadArea);

    /* ----------------------- ERROR CONTAINER ----------------------- */
    const errorContainer = createErrorContainer();
    wrapper.appendChild(errorContainer);

    /* ----------------------- PHOTO PREVIEW ----------------------- */
    const previewContainer = document.createElement("div");
    previewContainer.className = "upload-preview-container";

    const previewImg = document.createElement("img");
    previewImg.className = "photo-preview";
    previewImg.style.display = "none";
    previewImg.style.borderRadius = "6px";
    previewImg.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";

    // delete button for photo upload
    const photoDeleteBtn = document.createElement("button");
    photoDeleteBtn.type = "button";
    photoDeleteBtn.className = "photo-delete-btn";
    photoDeleteBtn.innerHTML = trashIconSvg;
    photoDeleteBtn.style.display = "none";

    const photoRow = document.createElement("div");
    photoRow.style.display = "flex";
    photoRow.style.alignItems = "center";
    const photoWrapper = document.createElement("div");
    photoWrapper.style.position = "relative";
    photoWrapper.style.display = "inline-block";

    photoWrapper.appendChild(previewImg);
    photoWrapper.appendChild(photoDeleteBtn);
    photoRow.appendChild(photoWrapper);

    previewContainer.appendChild(photoRow);
    wrapper.appendChild(previewContainer);

    uploadArea.addEventListener("click", () => !field.disabled && input.click());

    /* ----------------------- DRAG & DROP SUPPORT ----------------------- */
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("drag-over");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("drag-over");
    });

    uploadArea.addEventListener("drop", async (e) => {
        e.preventDefault();
        uploadArea.classList.remove("drag-over");

        if (field.disabled) return;

        const droppedFiles = e.dataTransfer?.files;
        if (!droppedFiles || droppedFiles.length === 0) return;

        const { isValid, lastError } = validateFiles(droppedFiles);
        state.lastErrors = state.lastErrors || {};
        state.lastErrors[field.id] = lastError;

        if (!isValid) {
            input.classList.add("error");
            return;
        }
        input.classList.remove("error");

        /* ---- Reuse file handling logic ---- */
        if (isPhotoUpload) {
            const file = droppedFiles[0];
            const base64Value = await fileToBase64(file);

            hideUploadArea();

            if (previewImg.src.startsWith("blob:")) {
                URL.revokeObjectURL(previewImg.src);
            }

            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = "block";
            photoDeleteBtn.style.display = "block";

            state.formData[field.id] = {
                value: base64Value,
                docType: field.id,
                format: file.type
            };
        } else {
            const previousFiles: any[] = Array.isArray(state.formData[field.id])
                ? [...(state.formData[field.id] as any[])]
                : [];

            let newFiles: any[] = [];

            if (!fileListContainer) {
                fileListContainer = document.createElement("div");
                fileListContainer.className = "uploaded-file-list";
                fileListContainer.style.marginTop = "10px";
                wrapper.appendChild(fileListContainer);
            }

            hideUploadArea();
            fileListContainer.style.display = "block";

            for (let i = 0; i < droppedFiles.length; i++) {
                const file = droppedFiles[i];
                const fileSizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(1));
                const base64Value = await fileToBase64(file);

                const fileItem = createDocumentPreviewItem(file.name, fileSizeMB, base64Value);
                fileListContainer.appendChild(fileItem);

                newFiles.push({
                    value: base64Value,
                    docType: field.id,
                    format: file.type
                });
            }

            state.formData[field.id] = [...previousFiles, ...newFiles];
        }
    });

    /* ----------------------- MULTIPLE DOC PREVIEW LIST ----------------------- */
    let fileListContainer: HTMLDivElement | null = null;

    const showUploadArea = () => {
        uploadArea.style.display = "block";
    };

    const hideUploadArea = () => {
        uploadArea.style.display = "none";
    };

    const createDocumentPreviewItem = (
        fileName: string,
        fileSizeMB: number,
        base64Value: string
    ) => {
        const item = document.createElement("div");
        item.className = "uploaded-file-item";
        const filePreviewLeft = document.createElement("div");
        filePreviewLeft.className = "file-preview-left";

        const fileIconDiv = document.createElement("div");
        fileIconDiv.className = "file-icon";
        fileIconDiv.innerHTML = fileIconSvg;

        const fileMeta = document.createElement("div");
        fileMeta.className = "file-meta";

        const fileNameDiv = document.createElement("div");
        fileNameDiv.className = "file-name";
        fileNameDiv.textContent = fileName;

        const fileSizeDiv = document.createElement("div");
        fileSizeDiv.className = "file-size";
        fileSizeDiv.textContent = `${fileSizeMB} MB`;

        fileMeta.appendChild(fileNameDiv);
        fileMeta.appendChild(fileSizeDiv);
        filePreviewLeft.appendChild(fileIconDiv);
        filePreviewLeft.appendChild(fileMeta);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "file-delete-btn";
        deleteBtn.innerHTML = trashIconSvg;

        item.appendChild(filePreviewLeft);
        item.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", () => {
            const savedFiles: any[] = Array.isArray(state.formData[field.id])
                ? [...state.formData[field.id] as any[]]
                : [];

            const index = savedFiles.findIndex(f => f.value === base64Value);
            if (index > -1) {
                savedFiles.splice(index, 1);
                state.formData[field.id] = savedFiles.length > 0 ? savedFiles : undefined;
                item.remove();
            }

            if (!state.formData[field.id] || (state.formData[field.id] as any[]).length === 0) {
                showUploadArea();
                if (fileListContainer) fileListContainer.style.display = "none";
            }
        });

        return item;
    };

    /* ----------------------- VALIDATION ----------------------- */
    function validateFiles(files: FileList) {
        appendError(errorContainer, "");
        let isValid = true;
        let lastError: number | "required" | null = null;

        if (field.required && files.length === 0) {
            const result = handleRequiredValidation(state, errorContainer);
            return { isValid: false, lastError: result.lastError };
        }

        for (const file of Array.from(files)) {
            if (!allowedTypes.includes(file.type)) {
                appendError(errorContainer, `Unsupported file type: ${file.name}`);
                isValid = false;
                lastError = 1001;
            }
            if (file.size > maxBytes) {
                appendError(errorContainer, `File too large (${file.name})`);
                isValid = false;
                lastError = 1002;
            }
        }

        return { isValid, lastError };
    }

    /* ----------------------- HANDLE FILE SELECTION ----------------------- */
    input.addEventListener("change", async (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;

        const { isValid, lastError } = validateFiles(files);
        state.lastErrors = state.lastErrors || {};
        state.lastErrors[field.id] = lastError;
        input.classList.toggle("error", !isValid);
        if (!isValid) return;

        if (isPhotoUpload) {
            const file = files[0];
            const base64Value = await fileToBase64(file);

            // hide upload area
            hideUploadArea();

            if (previewImg.src && previewImg.src.startsWith("blob:")) {
                URL.revokeObjectURL(previewImg.src);
            }
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = "block";
            photoDeleteBtn.style.display = "block";

            state.formData[field.id] = {
                value: base64Value,
                docType: field.id,
                format: file.type
            };

        } else {
            const previousFiles: any[] = Array.isArray(state.formData[field.id])
                ? [...(state.formData[field.id] as any[])]
                : [];

            let newFiles: any[] = [];

            if (!fileListContainer) {
                fileListContainer = document.createElement("div");
                fileListContainer.className = "uploaded-file-list";
                fileListContainer.style.marginTop = "10px";
                wrapper.appendChild(fileListContainer);
            }

            hideUploadArea();
            fileListContainer.style.display = "block";

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileSizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(1));
                const base64Value = await fileToBase64(file);

                const fileItem = createDocumentPreviewItem(file.name, fileSizeMB, base64Value);
                fileListContainer.appendChild(fileItem);

                newFiles.push({
                    value: base64Value,
                    docType: field.id,
                    format: file.type
                });
            }

            state.formData[field.id] = [...previousFiles, ...newFiles];
        }
    });

    /* ----------------------- PHOTO DELETE HANDLER ----------------------- */
    photoDeleteBtn.addEventListener("click", () => {
        previewImg.src = "";
        previewImg.style.display = "none";
        photoDeleteBtn.style.display = "none";

        state.formData[field.id] = undefined;

        showUploadArea();
    });

    return wrapper;
};
