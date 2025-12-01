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
    const isPhotoUpload = allowedTypes.some(t => t.startsWith("image/"));
    const maxSizeMB = field.maxFileSizeMB || 10;
    const maxBytes = maxSizeMB * 1024 * 1024;

    /* ----------------------- UPLOAD UI ----------------------- */
    const uploadArea = document.createElement("div");
    uploadArea.className = "custom-upload-area";

    const input = document.createElement("input");
    input.type = "file";
    input.id = field.id;
    input.multiple = !isPhotoUpload;
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
    previewContainer.style.position = "relative";
    previewContainer.style.marginTop = "10px";

    const previewImg = document.createElement("img");
    previewImg.className = "photo-preview";
    previewImg.style.display = "none";
    previewImg.style.maxWidth = "150px";
    previewImg.style.borderRadius = "6px";
    previewImg.style.boxShadow = "0 0 5px rgba(0,0,0,0.1)";

    previewContainer.appendChild(previewImg);
    wrapper.appendChild(previewContainer);

    uploadArea.addEventListener("click", () => !field.disabled && input.click());

    const createDocumentPreviewItem = (
        fileName: string,
        fileSizeMB: number,
        base64Value: string
    ) => {
        const item = document.createElement("div");
        item.className = "uploaded-file-item";
        item.innerHTML = `
        <div class="file-preview-left">
            <div class="file-icon">${fileIconSvg}</div>
            <div class="file-meta">
                <div class="file-name">${fileName}</div>
                <div class="file-size">${fileSizeMB} MB</div>
            </div>
        </div>
        <button type="button" class="file-delete-btn">
            ${trashIconSvg}
        </button>
    `;
        const deleteBtn = item.querySelector(".file-delete-btn") as HTMLButtonElement;
        deleteBtn.addEventListener("click", () => {
            const savedFiles: any[] = Array.isArray(state.formData[field.id])
                ? [...state.formData[field.id] as any[]]
                : [];

            const index = savedFiles.findIndex(f => f.value === base64Value);
            if (index > -1) {
                savedFiles.splice(index, 1);
                state.formData[field.id] = savedFiles.length > 0 ? savedFiles : undefined;
                item.remove();
                console.log("Deleted file:", state.formData);
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
            // Only first photo is allowed
            const file = files[0];
            const base64Value = await fileToBase64(file);

            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = "block";

            // FIX: Update the specific field ID directly
            state.formData[field.id] = {
                value: base64Value,
                docType: field.id,
                format: file.type
            };

        } else {
            // Multiple documents
            const previousFiles: any[] = Array.isArray(state.formData[field.id])
                ? [...(state.formData[field.id] as any[])]
                : [];

            let newFiles: any[] = [];

            let fileListContainer = wrapper.querySelector(".uploaded-file-list") as HTMLDivElement | null;
            if (!fileListContainer) {
                fileListContainer = document.createElement("div");
                fileListContainer.className = "uploaded-file-list";
                fileListContainer.style.marginTop = "10px";
                wrapper.appendChild(fileListContainer);
            }

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

            // FIX: Update the specific field ID directly
            state.formData[field.id] = [...previousFiles, ...newFiles];
        }
        console.log("Uploaded files for this field:", state.formData);
    });

    return wrapper;
};
